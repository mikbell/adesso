import { formidable } from "formidable";
import cloudinary from "cloudinary";
import Category from "../models/categoryModel.js";
import slugify from "slugify";
import { responseReturn } from "../utils/response.js";

/**
 * @description Aggiunge una nuova categoria, caricando l'immagine su Cloudinary.
 */
export const addCategory = async (req, res) => {
	const form = formidable({});
	try {
		const [fields, files] = await form.parse(req);
		const { name } = fields;
		const { image } = files;

		if (!name?.[0]) {
			return responseReturn(res, 400, {
				error: "Il nome della categoria è obbligatorio.",
			});
		}
		if (!image?.[0]) {
			return responseReturn(res, 400, {
				error: "L'immagine della categoria è obbligatoria.",
			});
		}

		const trimmedName = name[0].trim();
		const slug = slugify(trimmedName, { lower: true, strict: true });

		const existingCategory = await Category.findOne({
			$or: [{ name: trimmedName }, { slug }],
		});
		if (existingCategory) {
			return responseReturn(res, 409, {
				error: "Una categoria con questo nome o slug esiste già.",
			});
		}

		const result = await cloudinary.v2.uploader.upload(image[0].filepath, {
			folder: "adesso/categorie",
		});

		const newCategory = await Category.create({
			name: trimmedName,
			slug,
			image: result.secure_url,
			public_id: result.public_id,
		});

		responseReturn(res, 201, {
			message: "Categoria aggiunta con successo.",
			category: newCategory,
		});
	} catch (error) {
		console.error("Errore durante l'aggiunta della categoria:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Ottiene le categorie con paginazione e ricerca.
 */
export const getCategories = async (req, res) => {
	// ... (questa funzione è già corretta) ...
	const { page = 1, perPage = 10, search = "" } = req.query;

	try {
		const pageNumber = parseInt(page);
		const limit = parseInt(perPage);
		const skip = (pageNumber - 1) * limit;

		const searchQuery = search
			? { name: { $regex: search, $options: "i" } }
			: {};

		const categories = await Category.find(searchQuery)
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });

		const totalCategories = await Category.countDocuments(searchQuery);

		responseReturn(res, 200, { categories, totalCategories });
	} catch (error) {
		console.error("Errore nel caricamento delle categorie:", error);
		responseReturn(res, 500, {
			error: "Errore nel caricamento delle categorie.",
		});
	}
};

/**
 * @description Elimina una categoria e la sua immagine associata da Cloudinary.
 */
export const deleteCategory = async (req, res) => {
	const { categoryId } = req.params;

	try {
		const category = await Category.findByIdAndDelete(categoryId);

		if (!category) {
			return responseReturn(res, 404, { error: "Categoria non trovata." });
		}

		// ▼▼▼ CORREZIONE QUI ▼▼▼
		if (category.public_id) {
			await cloudinary.v2.uploader.destroy(category.public_id);
		}

		responseReturn(res, 200, { message: "Categoria eliminata con successo." });
	} catch (error) {
		console.error("Errore nell'eliminazione della categoria:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};
