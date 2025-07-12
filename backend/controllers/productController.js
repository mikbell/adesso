import { formidable } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";
import { responseReturn } from "../utils/response.js";

/**
 * @description Aggiunge un nuovo prodotto, gestendo l'upload di più immagini.
 */
export const addProduct = async (req, res) => {
	const form = formidable({ multiples: true });

	try {
		const [fields, files] = await form.parse(req);

		const { name, brand, description, price, discount, stock, category } =
			fields;

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

		const imageUploadPromises = imageFiles.map((image) =>
			cloudinary.uploader.upload(image.filepath, { folder: "adesso/prodotti" })
		);

		const uploadedImages = await Promise.all(imageUploadPromises);
		const imagesArray = uploadedImages.map((result) => ({
			url: result.secure_url,
			public_id: result.public_id,
		}));

		const product = await Product.create({
			name: name[0],
			brand: brand?.[0],
			slug: name[0].trim().toLowerCase().split(" ").join("-"),
			description: description?.[0],
			price: parseInt(price[0], 10),
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
		responseReturn(res, 500, { error: "Errore interno del server" });
	}
};

/**
 * @description Recupera i prodotti con paginazione e ricerca.
 */
export const getProducts = async (req, res) => {
	const { page = 1, perPage = 10, search = "" } = req.query;

	try {
		const pageNum = parseInt(page);
		const limit = parseInt(perPage);
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
			.sort({ createdAt: -1 });
		const totalProducts = await Product.countDocuments(queryOptions);

		responseReturn(res, 200, { products, totalProducts });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero dei prodotti" });
	}
};

/**
 * @description Recupera un singolo prodotto tramite ID.
 */
export const getProduct = async (req, res) => {
	const { productId } = req.params;
	try {
		const product = await Product.findById(productId);
		if (!product) {
			return responseReturn(res, 404, { error: "Prodotto non trovato" });
		}
		responseReturn(res, 200, { product });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero del prodotto" });
	}
};

/**
 * @description Aggiorna un prodotto esistente.
 */
export const updateProduct = async (req, res) => {
	const { productId } = req.params;
	const form = formidable({ multiples: true });

	try {
		const [fields, files] = await form.parse(req);
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
		} = fields;

		let currentImages = existingImages ? JSON.parse(existingImages[0]) : [];
		const toDelete = imagesToRemove ? JSON.parse(imagesToRemove[0]) : [];

		if (toDelete.length > 0) {
			const deletePromises = toDelete.map((publicId) =>
				cloudinary.uploader.destroy(publicId)
			);
			await Promise.all(deletePromises);
			currentImages = currentImages.filter(
				(img) => !toDelete.includes(img.public_id)
			);
		}

		if (files.newImages) {
			const uploadPromises = files.newImages.map((file) =>
				cloudinary.uploader.upload(file.filepath, { folder: "adesso/prodotti" })
			);
			const uploaded = await Promise.all(uploadPromises);
			const newImageData = uploaded.map((result) => ({
				url: result.secure_url,
				public_id: result.public_id,
			}));
			currentImages.push(...newImageData);
		}

		const product = await Product.findByIdAndUpdate(
			productId,
			{
				name: name[0],
				brand: brand[0],
				slug: name[0].trim().toLowerCase().split(" ").join("-"),
				description: description[0],
				price: parseFloat(price[0]),
				discount: parseInt(discount[0]),
				stock: parseInt(stock[0]),
				category: category[0],
				images: currentImages,
			},
			{ new: true }
		);

		if (!product) {
			return responseReturn(res, 404, {
				error: "Prodotto non trovato da aggiornare",
			});
		}
		responseReturn(res, 200, {
			product,
			message: "Prodotto aggiornato con successo",
		});
	} catch (error) {
		console.error("Errore nell'aggiornamento del prodotto:", error);
		responseReturn(res, 500, { error: "Errore interno del server" });
	}
};

/**
 * @description Elimina un prodotto e tutte le sue immagini associate.
 */
export const deleteProduct = async (req, res) => {
	const { productId } = req.params;
	try {
		const product = await Product.findByIdAndDelete(productId);
		if (!product) {
			return responseReturn(res, 404, { error: "Prodotto non trovato" });
		}

		if (product.images && product.images.length > 0) {
			const deletePromises = product.images.map((img) =>
				cloudinary.uploader.destroy(img.public_id)
			);
			await Promise.all(deletePromises);
		}

		responseReturn(res, 200, { message: "Prodotto eliminato con successo" });
	} catch (error) {
		console.error("Errore nell'eliminazione del prodotto:", error);
		responseReturn(res, 500, { error: "Errore interno del server" });
	}
};
