import { formidable } from "formidable";
import cloudinary from "cloudinary";
import Category from "../models/categoryModel.js";
import slugify from "slugify";
import { responseReturn } from "../utils/response.js";

export const getCategories = async (req, res) => {};

export const addCategory = async (req, res) => {
	try {
		// 1. Usa la versione promise-based di Formidable per un codice async/await pulito
		const form = formidable({});
		const [fields, files] = await form.parse(req);

		// 2. Estrai e valida l'input
		const { name } = fields;
		const { image } = files;

		if (!name || !name[0]) {
			responseReturn(res, 400, {
				error: "Il nome della categoria é obbligatorio.",
			});
		}
		if (!image || !image[0]) {
			responseReturn(res, 400, {
				error: "L'immagine della categoria é obbligatorio.",
			});
		}

		const trimmedName = name[0].trim();
		if (trimmedName.length === 0) {
			responseReturn(res, 400, {
				error: "Il nome della categoria non puo essere vuoto.",
			});
		}

		// 3. Genera uno slug robusto
		const slug = slugify(trimmedName, {
			lower: true, // tutto minuscolo
			strict: true, // rimuove caratteri speciali
			remove: /[*+~.()'"!:@]/g, // regex per rimuovere altri caratteri indesiderati
		});

		// 4. Controlla se una categoria con lo stesso nome o slug esiste già
		const existingCategory = await Category.findOne({
			$or: [{ name: trimmedName }, { slug }],
		});
		if (existingCategory) {
			responseReturn(res, 400, {
				error: "Una categoria con lo stesso nome o slug esiste gia.",
			});
		}

		// 5. Carica l'immagine su Cloudinary
		const result = await cloudinary.v2.uploader.upload(image[0].filepath, {
			folder: "adesso/categorie", // Assicurati che la cartella esista
		});

		// 6. Crea e salva la nuova categoria nel database
		const newCategory = new Category({
			name: trimmedName,
			slug,
			image: result.secure_url,
		});

		const savedCategory = await newCategory.save();

		// 7. Invia una risposta di successo con lo status code corretto (201 Created)
		responseReturn(res, 201, {
			message: "Categoria aggiunta con successo.",
			category: savedCategory,
		});
	} catch (error) {
		// 8. Gestione centralizzata degli errori
		console.error("Errore durante l'aggiunta della categoria:", error);
		responseReturn(res, 500, {
			error: "Errore durante l'aggiunta della categoria.",
		});
	}
};
