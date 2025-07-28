import { formidable } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js"; // Assicurati che il percorso al modello sia corretto
import { responseReturn } from "../utils/response.js"; // Assicurati che il percorso all'utility sia corretto
import mongoose from "mongoose";
import slugify from "slugify";

/**
 * @description Aggiunge un nuovo prodotto, gestendo l'upload di più immagini.
 */
export const addProduct = async (req, res) => {
	const form = formidable({ multiples: true });

	try {
		// Estrai l'ID dell'utente autenticato dal request object
		const sellerId = req.id; // <-- ASSUMI CHE IL MIDDLEWARE DI AUTENTICAZIONE IMPOSTI req.id

		const [fields, files] = await form.parse(req);

		// Normalize field values from arrays to single strings, or undefined if not present
		const data = Object.fromEntries(
			Object.entries(fields).map(([key, value]) => [key, value?.[0]])
		);

		const { name, brand, description, price, discount, stock, category } = data;

		// Validazione dei campi obbligatori
		if (!name || !price || !stock || !category) {
			responseReturn(res, 400, {
				error: "I campi nome, prezzo, stock e categoria sono obbligatori.",
			});
			return;
		}

		const imageFiles = files.images || [];
		if (imageFiles.length === 0) {
			responseReturn(res, 400, {
				error: "È richiesta almeno un'immagine.",
			});
			return;
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

		const productSlug = slugify(name, { lower: true, strict: true });

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
			seller: sellerId, // <-- AGGIUNGI QUI IL CAMPO SELLER CON L'ID DELL'UTENTE
		});

		responseReturn(res, 201, {
			message: "Prodotto aggiunto con successo",
			product,
		});
	} catch (error) {
		console.error("Errore nell'aggiunta del prodotto:", error);
		// Distinguish between validation errors and internal errors
		if (error.name === "ValidationError") {
			responseReturn(res, 400, { error: error.message });
			return;
		}
		responseReturn(res, 500, {
			error: "Errore interno del server durante l'aggiunta del prodotto",
		});
	}
};

/**
 * @description Recupera i prodotti con paginazione, ricerca, filtri (prezzo, categoria, rating, scontati) e ordinamento.
 */
export const getProducts = async (req, res) => {
	// Estrai tutti i parametri di query, inclusi i nuovi filtri
	const {
		page = 1,
		perPage = 10,
		search = "",
		minPrice,
		maxPrice,
		category,
		rating,
		sortBy,
		showDiscountedOnly, // NUOVO PARAMETRO QUI
	} = req.query;

	try {
		const pageNum = parseInt(page, 10);
		const limit = parseInt(perPage, 10);
		const searchTerm = search.trim();
		const skip = (pageNum - 1) * limit;

		let queryOptions = {};

		// 1. Filtro di Ricerca (Search Term)
		if (searchTerm) {
			queryOptions.$or = [
				{ name: { $regex: searchTerm, $options: "i" } },
				{ brand: { $regex: searchTerm, $options: "i" } },
				{ description: { $regex: searchTerm, $options: "i" } },
			];
		}

		// 2. Filtro per Prezzo (minPrice, maxPrice)
		if (minPrice || maxPrice) {
			queryOptions.price = {};
			if (minPrice) {
				queryOptions.price.$gte = parseFloat(minPrice);
			}
			if (maxPrice) {
				queryOptions.price.$lte = parseFloat(maxPrice);
			}
		}

		// 3. Filtro per Categoria (Category)
		if (category && category !== "Tutte") {
			if (Array.isArray(category)) {
				queryOptions.category = { $in: category };
			} else {
				queryOptions.category = category;
			}
		}

		// 4. Filtro per Valutazione (Rating)
		if (rating && parseInt(rating, 10) > 0) {
			queryOptions.rating = { $gte: parseInt(rating, 10) };
		}

		// NUOVO: 5. Filtro per Prodotti Scontati
		if (showDiscountedOnly === "true") {
			queryOptions.discount = { $gt: 0 };
		}

		// 6. Ordinamento (SortBy)
		let sortOptions = { createdAt: -1 };

		if (sortBy) {
			switch (sortBy) {
				case "popularity":
					sortOptions = { salesCount: -1 };
					break;
				case "price-asc":
					sortOptions = { price: 1 };
					break;
				case "price-desc":
					sortOptions = { price: -1 };
					break;
				case "rating-desc":
					sortOptions = { rating: -1 };
					break;
				default:
					sortOptions = { createdAt: -1 };
			}
		}

		const products = await Product.find(queryOptions)
			.skip(skip)
			.limit(limit)
			.sort(sortOptions);

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

// --- NUOVE FUNZIONI PER LA HOMEPAGE ---

/**
 * @description Recupera un numero limitato di prodotti più recenti per la homepage.
 */
export const getLatestProducts = async (req, res) => {
	// Puoi passare un limite come query param o definirlo fisso qui
	const { limit = 8 } = req.query; // Default a 8 prodotti, puoi cambiarlo

	try {
		const products = await Product.find({})
			.sort({ createdAt: -1 }) // Ordina dal più recente al meno recente
			.limit(parseInt(limit, 10)); // Limita il numero di risultati

		responseReturn(res, 200, { products });
	} catch (error) {
		console.error("Errore nel recupero dei prodotti più recenti:", error);
		responseReturn(res, 500, {
			error:
				"Errore interno del server durante il recupero dei prodotti più recenti",
		});
	}
};

/**
 * @description Recupera un numero limitato di prodotti in sconto per la homepage.
 * Ordina per percentuale di sconto decrescente.
 */
export const getDiscountedProducts = async (req, res) => {
	const { limit = 8 } = req.query; // Default a 8 prodotti in sconto

	try {
		const products = await Product.find({
			discount: { $gt: 0 }, // Cerca prodotti con sconto maggiore di 0
		})
			.sort({ discount: -1, createdAt: -1 }) // Ordina prima per sconto (decrescente), poi per data di creazione
			.limit(parseInt(limit, 10)); // Limita il numero di risultati

		responseReturn(res, 200, { products });
	} catch (error) {
		console.error("Errore nel recupero dei prodotti in sconto:", error);
		responseReturn(res, 500, {
			error:
				"Errore interno del server durante il recupero dei prodotti in sconto",
		});
	}
};

/**
 * @description Recupera un numero limitato di prodotti più votati per la homepage.
 * Richiede un campo 'averageRating' e 'numberOfReviews' nel modello Product.
 */
export const getTopRatedProducts = async (req, res) => {
	const { limit = 8, minReviews = 3 } = req.query; // Default a 8 prodotti, minimo 3 recensioni

	try {
		const products = await Product.find({
			// Assumi che il modello Product abbia un campo 'averageRating' e 'numberOfReviews'
			// Assicurati che 'averageRating' sia un numero e che 'numberOfReviews' sia >= minReviews
			averageRating: { $exists: true, $ne: null, $gte: 1 }, // Solo prodotti con rating esistente e > 0
			numberOfReviews: {
				$exists: true,
				$ne: null,
				$gte: parseInt(minReviews, 10),
			}, // Almeno 'minReviews' recensioni
		})
			.sort({ averageRating: -1, numberOfReviews: -1 }) // Ordina per rating medio (decrescente), poi per numero di recensioni
			.limit(parseInt(limit, 10)); // Limita il numero di risultati

		responseReturn(res, 200, { products });
	} catch (error) {
		console.error("Errore nel recupero dei prodotti più votati:", error);
		responseReturn(res, 500, {
			error:
				"Errore interno del server durante il recupero dei prodotti più votati",
		});
	}
};
