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

		// Normalize field values from arrays to single strings, or undefined if not present
		const data = Object.fromEntries(
			Object.entries(fields).map(([key, value]) => [key, value?.[0]])
		);

		const { name, brand, description, price, discount, stock, category } = data;

		// Validazione dei campi obbligatori
		if (!name || !price || !stock || !category) {
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

		// Use a slugify library for more robust slug generation
		// Example: If you install 'slugify' (npm install slugify)
		// import slugify from 'slugify';
		// const productSlug = slugify(name, { lower: true, strict: true });
		const productSlug = name
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, ""); // More robust custom slug

		// Creazione del prodotto nel database
		const product = await Product.create({
			name: name.trim(),
			brand: brand ? brand.trim() : "",
			slug: productSlug,
			description: description ? description.trim() : "",
			price: parseFloat(price),
			discount: parseInt(discount || "0", 10),
			stock: parseInt(stock, 10),
			category: category.trim(),
			images: imagesArray,
		});

		responseReturn(res, 201, {
			message: "Prodotto aggiunto con successo",
			product,
		});
	} catch (error) {
		console.error("Errore nell'aggiunta del prodotto:", error);
		// Distinguish between validation errors and internal errors
		if (error.name === "ValidationError") {
			return responseReturn(res, 400, { error: error.message });
		}
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
		const pageNum = parseInt(page, 10);
		const limit = parseInt(perPage, 10);
		const searchTerm = search.trim();
		const skip = (pageNum - 1) * limit;

		let queryOptions = {};
		if (searchTerm) {
			// Option 1: Using $regex for flexible partial matching (can be slow on large datasets without appropriate indexes)
			queryOptions = {
				$or: [
					{ name: { $regex: searchTerm, $options: "i" } },
					{ brand: { $regex: searchTerm, $options: "i" } },
					{ description: { $regex: searchTerm, $options: "i" } }, // Assuming you want to search description too
				],
			};
			// Option 2: Using $text index (more performant for full-text search, requires 'text' index on schema)
			// If you have a text index defined on name, brand, description in your Product schema:
			// queryOptions.$text = { $search: searchTerm };
			// Note: $text search prioritizes exact matches and word boundaries.
			// You might combine both or choose based on your needs.
		}

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
	const { productId } = req.params;

	try {
		let product;
		// Try to find by _id first, as it's typically faster
		if (mongoose.Types.ObjectId.isValid(productId)) {
			product = await Product.findById(productId)
				.populate("reviews") // Populate reviews if you need review details
				.populate("relatedProducts"); // Populate related products details
		}

		// If not found by ID, or if the param wasn't a valid ID, try with slug
		if (!product) {
			product = await Product.findOne({ slug: productId })
				.populate("reviews")
				.populate("relatedProducts");
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
	const { productId } = req.params;
	const form = formidable({ multiples: true });

	try {
		let productToUpdate;
		if (mongoose.Types.ObjectId.isValid(productId)) {
			productToUpdate = await Product.findById(productId);
		}
		if (!productToUpdate) {
			productToUpdate = await Product.findOne({ slug: productId });
		}

		if (!productToUpdate) {
			return responseReturn(res, 404, {
				error: "Prodotto non trovato per l'aggiornamento.",
			});
		}

		const [fields, files] = await form.parse(req);

		// Normalize field values
		const data = Object.fromEntries(
			Object.entries(fields).map(([key, value]) => [key, value?.[0]])
		);

		const {
			name,
			brand,
			description,
			price,
			discount,
			stock,
			category,
			existingImages,
			imagesToRemove,
		} = data;

		let currentImages = existingImages ? JSON.parse(existingImages) : [];
		const toDelete = imagesToRemove ? JSON.parse(imagesToRemove) : [];

		// Elimina le immagini da Cloudinary
		if (toDelete.length > 0) {
			const deletePromises = toDelete.map((publicId) =>
				cloudinary.uploader.destroy(publicId)
			);
			await Promise.all(deletePromises);
			currentImages = currentImages.filter(
				(img) => !toDelete.includes(img.public_id)
			);
		}

		// Carica le nuove immagini
		if (files.newImages) {
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

		// Prepare updated fields
		const updatedFields = {};

		if (name) {
			updatedFields.name = name.trim();
			// Update slug only if name changes
			updatedFields.slug = name
				.trim()
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
		}
		if (brand !== undefined) updatedFields.brand = brand.trim();
		if (description !== undefined)
			updatedFields.description = description.trim();
		if (price !== undefined) updatedFields.price = parseFloat(price);
		if (discount !== undefined) updatedFields.discount = parseInt(discount, 10);
		if (stock !== undefined) updatedFields.stock = parseInt(stock, 10);
		if (category !== undefined) updatedFields.category = category.trim();

		updatedFields.images = currentImages; // Always update images array

		const updatedProduct = await Product.findByIdAndUpdate(
			productToUpdate._id,
			{ $set: updatedFields },
			{ new: true, runValidators: true }
		);

		responseReturn(res, 200, {
			product: updatedProduct,
			message: "Prodotto aggiornato con successo",
		});
	} catch (error) {
		console.error("Errore nell'aggiornamento del prodotto:", error);
		if (error.name === "ValidationError") {
			return responseReturn(res, 400, { error: error.message });
		}
		responseReturn(res, 500, {
			error: "Errore interno del server durante l'aggiornamento del prodotto",
		});
	}
};

/**
 * @description Elimina un prodotto e tutte le sue immagini associate.
 */
export const deleteProduct = async (req, res) => {
	const { productId } = req.params;

	try {
		let productToDelete;
		if (mongoose.Types.ObjectId.isValid(productId)) {
			productToDelete = await Product.findById(productId);
		}
		if (!productToDelete) {
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
