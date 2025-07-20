import { formidable } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";
import { responseReturn } from "../utils/response.js";
import mongoose from "mongoose"; // <-- AGGIUNTO: Importa mongoose per la validazione dell'ObjectId

/**
 * @description Aggiunge un nuovo prodotto, gestendo l'upload di più immagini.
 */
export const addProduct = async (req, res) => {
	const form = formidable({ multiples: true });

	try {
		const [fields, files] = await form.parse(req);

		const { name, brand, description, price, discount, stock, category } =
			fields;

		// Validazione dei campi obbligatori
		if (!name?.[0] || !price?.[0] || !stock?.[0] || !category?.[0]) {
			return responseReturn(res, 400, {
				error: "I campi nome, prezzo, stock e categoria sono obbligatori.",
			});
		}

		const imageFiles = files.images || [];
		if (imageFiles.length === 0) {
			return responseReturn(res, 400, {
				error: "È richiesta almeno un'immagine.",
			});
		}

		// Upload delle immagini su Cloudinary
		const imageUploadPromises = imageFiles.map((image) =>
			cloudinary.uploader.upload(image.filepath, { folder: "adesso/prodotti" })
		);

		const uploadedImages = await Promise.all(imageUploadPromises);
		const imagesArray = uploadedImages.map((result) => ({
			url: result.secure_url,
			public_id: result.public_id,
		}));

		// Creazione del prodotto nel database
		const product = await Product.create({
			name: name[0],
			brand: brand?.[0] || "", // Assicurati che il brand sia una stringa vuota se non fornito
			slug: name[0].trim().toLowerCase().split(" ").join("-"),
			description: description?.[0] || "", // Assicurati che la descrizione sia una stringa vuota se non fornita
			price: parseFloat(price[0]), // Utilizza parseFloat per coerenza con updateProduct
			discount: parseInt(discount?.[0] || "0", 10),
			stock: parseInt(stock[0], 10),
			category: category[0],
			images: imagesArray,
		});

		responseReturn(res, 201, {
			message: "Prodotto aggiunto con successo",
			product,
		});
	} catch (error) {
		console.error("Errore nell'aggiunta del prodotto:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante l'aggiunta del prodotto",
		});
	}
};

/**
 * @description Recupera i prodotti con paginazione e ricerca.
 */
export const getProducts = async (req, res) => {
	const { page = 1, perPage = 10, search = "" } = req.query;

	try {
		const pageNum = parseInt(page, 10); // Aggiunto base 10
		const limit = parseInt(perPage, 10); // Aggiunto base 10
		const searchTerm = search.trim();
		const skip = (pageNum - 1) * limit;

		const queryOptions = searchTerm
			? {
					$or: [
						{ name: { $regex: searchTerm, $options: "i" } },
						{ brand: { $regex: searchTerm, $options: "i" } },
					],
			  }
			: {};

		const products = await Product.find(queryOptions)
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 }); // Ordina dal più recente al meno recente

		const totalProducts = await Product.countDocuments(queryOptions);

		responseReturn(res, 200, { products, totalProducts });
	} catch (error) {
		console.error("Errore nel recupero dei prodotti:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante il recupero dei prodotti",
		});
	}
};

/**
 * @description Recupera un singolo prodotto tramite ID o Slug.
 */
export const getProduct = async (req, res) => {
	const { productId } = req.params; // Questo può essere _id o slug

	try {
		let product;
		// Controlla se il parametro è un ObjectId valido
		if (mongoose.Types.ObjectId.isValid(productId)) {
			product = await Product.findById(productId);
		}

		// Se non è stato trovato tramite ID, o se il parametro non era un ID, prova con lo slug
		if (!product) {
			product = await Product.findOne({ slug: productId });
		}

		if (!product) {
			return responseReturn(res, 404, { error: "Prodotto non trovato" });
		}
		responseReturn(res, 200, { product });
	} catch (error) {
		console.error("Errore nel recupero del prodotto:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante il recupero del prodotto",
		});
	}
};

/**
 * @description Aggiorna un prodotto esistente.
 */
export const updateProduct = async (req, res) => {
	const { productId } = req.params; // Ora mi aspetto un _id o uno slug dal frontend
	const form = formidable({ multiples: true });

	try {
		// Trova il prodotto esistente prima di aggiornare
		let productToUpdate;
		if (mongoose.Types.ObjectId.isValid(productId)) {
			productToUpdate = await Product.findById(productId);
		}
		if (!productToUpdate) {
			// Se non trovato per ID, prova con slug
			productToUpdate = await Product.findOne({ slug: productId });
		}

		if (!productToUpdate) {
			return responseReturn(res, 404, {
				error: "Prodotto non trovato per l'aggiornamento.",
			});
		}

		const [fields, files] = await form.parse(req);
		const {
			name,
			brand,
			description,
			price,
			discount,
			stock,
			category,
			existingImages, // stringified JSON array of { url, public_id }
			imagesToRemove, // stringified JSON array of public_id
		} = fields;

		let currentImages = existingImages ? JSON.parse(existingImages[0]) : [];
		const toDelete = imagesToRemove ? JSON.parse(imagesToRemove[0]) : [];

		// Elimina le immagini da Cloudinary
		if (toDelete.length > 0) {
			const deletePromises = toDelete.map((publicId) =>
				cloudinary.uploader.destroy(publicId)
			);
			await Promise.all(deletePromises);
			// Filtra le immagini correnti per rimuovere quelle eliminate
			currentImages = currentImages.filter(
				(img) => !toDelete.includes(img.public_id)
			);
		}

		// Carica le nuove immagini
		if (files.newImages) {
			// Assicurati che files.newImages sia un array, anche se c'è una sola immagine
			const newImageFiles = Array.isArray(files.newImages)
				? files.newImages
				: [files.newImages];

			const uploadPromises = newImageFiles.map((file) =>
				cloudinary.uploader.upload(file.filepath, { folder: "adesso/prodotti" })
			);
			const uploaded = await Promise.all(uploadPromises);
			const newImageData = uploaded.map((result) => ({
				url: result.secure_url,
				public_id: result.public_id,
			}));
			currentImages.push(...newImageData);
		}

		// Aggiorna i campi del prodotto
		const updatedFields = {
			name: name?.[0],
			brand: brand?.[0],
			slug: name?.[0]
				? name[0].trim().toLowerCase().split(" ").join("-")
				: productToUpdate.slug, // Mantieni slug se il nome non cambia
			description: description?.[0],
			price: price?.[0] ? parseFloat(price[0]) : undefined,
			discount: discount?.[0] ? parseInt(discount[0], 10) : undefined,
			stock: stock?.[0] ? parseInt(stock[0], 10) : undefined,
			category: category?.[0],
			images: currentImages,
		};

		// Rimuovi i campi undefined per evitare di sovrascrivere con valori vuoti se non forniti
		Object.keys(updatedFields).forEach(
			(key) => updatedFields[key] === undefined && delete updatedFields[key]
		);

		const updatedProduct = await Product.findByIdAndUpdate(
			productToUpdate._id, // Aggiorna sempre tramite l'ObjectId effettivo trovato
			{ $set: updatedFields }, // Usa $set per aggiornare solo i campi forniti
			{ new: true, runValidators: true } // runValidators per eseguire le validazioni dello schema
		);

		responseReturn(res, 200, {
			product: updatedProduct,
			message: "Prodotto aggiornato con successo",
		});
	} catch (error) {
		console.error("Errore nell'aggiornamento del prodotto:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante l'aggiornamento del prodotto",
		});
	}
};

/**
 * @description Elimina un prodotto e tutte le sue immagini associate.
 */
export const deleteProduct = async (req, res) => {
	const { productId } = req.params; // Questo può essere _id o slug

	try {
		let productToDelete;
		if (mongoose.Types.ObjectId.isValid(productId)) {
			productToDelete = await Product.findById(productId);
		}
		if (!productToDelete) {
			// Se non trovato per ID, prova con slug
			productToDelete = await Product.findOne({ slug: productId });
		}

		if (!productToDelete) {
			return responseReturn(res, 404, { error: "Prodotto non trovato" });
		}

		// Elimina il prodotto dal database usando il suo _id effettivo
		const product = await Product.findByIdAndDelete(productToDelete._id);

		// Elimina le immagini associate da Cloudinary
		if (product.images && product.images.length > 0) {
			const deletePromises = product.images.map((img) =>
				cloudinary.uploader.destroy(img.public_id)
			);
			await Promise.all(deletePromises);
		}

		responseReturn(res, 200, { message: "Prodotto eliminato con successo" });
	} catch (error) {
		console.error("Errore nell'eliminazione del prodotto:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante l'eliminazione del prodotto",
		});
	}
};
