import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js"; // Per la gestione dei riferimenti ai prodotti
import { responseReturn } from "../utils/response.js";
import mongoose from "mongoose";

/**
 * @description Crea una nuova recensione per un prodotto.
 * @route POST /api/reviews
 * @access Private (solo utenti autenticati)
 */
export const addReview = async (req, res) => {
	// Presuppone che l'ID dell'utente sia disponibile in req.user._id dopo l'autenticazione
	const { _id: userId } = req.user; // Se usi Passport, JWT, ecc., l'utente è in req.user
	const { productId, rating, comment, title } = req.body;

	try {
		// 1. Validazione di base
		if (!productId || !rating) {
			return responseReturn(res, 400, {
				error: "ID Prodotto e Rating sono obbligatori.",
			});
		}

		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return responseReturn(res, 400, {
				error: "ID Prodotto non valido.",
			});
		}

		// 2. Verifica se il prodotto esiste
		const product = await Product.findById(productId);
		if (!product) {
			return responseReturn(res, 404, { error: "Prodotto non trovato." });
		}

		// 3. Verifica se l'utente ha già recensito questo prodotto (opzionale ma consigliato)
		const alreadyReviewed = await Review.findOne({
			product: productId,
			user: userId,
		});

		if (alreadyReviewed) {
			return responseReturn(res, 400, {
				error: "Hai già recensito questo prodotto.",
			});
		}

		// 4. Crea la recensione
		const review = await Review.create({
			product: productId,
			user: userId,
			rating,
			comment: comment || "", // Assicurati che il commento sia una stringa vuota se non fornito
			title: title || "", // Assicurati che il titolo sia una stringa vuota se non fornito
		});

		// Il middleware post-save nel modello Review si occuperà di aggiornare
		// averageRating e numReviews nel modello Product.

		responseReturn(res, 201, {
			message: "Recensione aggiunta con successo!",
			review,
		});
	} catch (error) {
		console.error("Errore nell'aggiunta della recensione:", error);
		if (error.name === "ValidationError") {
			return responseReturn(res, 400, { error: error.message });
		}
		responseReturn(res, 500, {
			error: "Errore interno del server durante l'aggiunta della recensione.",
		});
	}
};

/**
 * @description Recupera tutte le recensioni per un prodotto specifico.
 * @route GET /api/reviews/product/:productId
 * @access Public
 */
export const getProductReviews = async (req, res) => {
	const { productId } = req.params;
	const { page = 1, perPage = 10 } = req.query;

	try {
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return responseReturn(res, 400, {
				error: "ID Prodotto non valido.",
			});
		}

		const pageNum = parseInt(page, 10);
		const limit = parseInt(perPage, 10);
		const skip = (pageNum - 1) * limit;

		const reviews = await Review.find({ product: productId })
			.populate("user", "name email") // Popola i dettagli dell'utente (nome ed email)
			.sort({ createdAt: -1 }) // Ordina le recensioni dalla più recente
			.skip(skip)
			.limit(limit);

		const totalReviews = await Review.countDocuments({ product: productId });

		responseReturn(res, 200, { reviews, totalReviews });
	} catch (error) {
		console.error("Errore nel recupero delle recensioni del prodotto:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante il recupero delle recensioni.",
		});
	}
};

/**
 * @description Recupera una singola recensione tramite il suo ID.
 * @route GET /api/reviews/:reviewId
 * @access Public (o Private se preferisci)
 */
export const getReview = async (req, res) => {
	const { reviewId } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(reviewId)) {
			return responseReturn(res, 400, {
				error: "ID Recensione non valido.",
			});
		}

		const review = await Review.findById(reviewId)
			.populate("user", "name email")
			.populate("product", "name slug");

		if (!review) {
			return responseReturn(res, 404, { error: "Recensione non trovata." });
		}

		responseReturn(res, 200, { review });
	} catch (error) {
		console.error("Errore nel recupero della recensione:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante il recupero della recensione.",
		});
	}
};

/**
 * @description Aggiorna una recensione esistente.
 * @route PUT /api/reviews/:reviewId
 * @access Private (solo l'autore della recensione o un admin)
 */
export const updateReview = async (req, res) => {
	const { reviewId } = req.params;
	const { rating, comment, title } = req.body;
	const { _id: userId } = req.user; // Utente autenticato

	try {
		if (!mongoose.Types.ObjectId.isValid(reviewId)) {
			return responseReturn(res, 400, {
				error: "ID Recensione non valido.",
			});
		}

		const review = await Review.findById(reviewId);

		if (!review) {
			return responseReturn(res, 404, { error: "Recensione non trovata." });
		}

		// Verifica l'autorizzazione: solo l'utente che ha creato la recensione può modificarla
		// Oppure un utente con ruolo 'admin'
		if (
			review.user.toString() !==
			userId.toString() /* && req.user.role !== 'admin' */
		) {
			return responseReturn(res, 403, {
				error: "Non autorizzato a modificare questa recensione.",
			});
		}

		// Applica gli aggiornamenti
		review.rating = rating || review.rating; // Permette di non aggiornare il rating se non fornito
		review.comment = comment !== undefined ? comment : review.comment; // Permette di svuotare il commento
		review.title = title !== undefined ? title : review.title; // Permette di svuotare il titolo

		// Salva la recensione aggiornata
		const updatedReview = await review.save();

		// Il middleware post-save nel modello Review si occuperà di aggiornare
		// averageRating e numReviews nel modello Product.

		responseReturn(res, 200, {
			message: "Recensione aggiornata con successo!",
			review: updatedReview,
		});
	} catch (error) {
		console.error("Errore nell'aggiornamento della recensione:", error);
		if (error.name === "ValidationError") {
			return responseReturn(res, 400, { error: error.message });
		}
		responseReturn(res, 500, {
			error:
				"Errore interno del server durante l'aggiornamento della recensione.",
		});
	}
};

/**
 * @description Elimina una recensione.
 * @route DELETE /api/reviews/:reviewId
 * @access Private (solo l'autore della recensione o un admin)
 */
export const deleteReview = async (req, res) => {
	const { reviewId } = req.params;
	const { _id: userId } = req.user; // Utente autenticato

	try {
		if (!mongoose.Types.ObjectId.isValid(reviewId)) {
			return responseReturn(res, 400, {
				error: "ID Recensione non valido.",
			});
		}

		const review = await Review.findById(reviewId);

		if (!review) {
			return responseReturn(res, 404, { error: "Recensione non trovata." });
		}

		// Verifica l'autorizzazione: solo l'utente che ha creato la recensione può eliminarla
		// Oppure un utente con ruolo 'admin'
		if (
			review.user.toString() !==
			userId.toString() /* && req.user.role !== 'admin' */
		) {
			return responseReturn(res, 403, {
				error: "Non autorizzato a eliminare questa recensione.",
			});
		}

		// Elimina la recensione
		await Review.findByIdAndDelete(reviewId);

		// Il middleware post-findOneAndDelete nel modello Review si occuperà di aggiornare
		// averageRating e numReviews nel modello Product.

		responseReturn(res, 200, {
			message: "Recensione eliminata con successo!",
		});
	} catch (error) {
		console.error("Errore nell'eliminazione della recensione:", error);
		responseReturn(res, 500, {
			error:
				"Errore interno del server durante l'eliminazione della recensione.",
		});
	}
};

/**
 * @description Recupera tutte le recensioni lasciate da un utente specifico.
 * @route GET /api/reviews/user/:userId
 * @access Private (admin) o Private (l'utente stesso)
 */
export const getUserReviews = async (req, res) => {
	const { userId: paramUserId } = req.params;
	const { _id: authenticatedUserId, role } = req.user; // Utente autenticato e il suo ruolo
	const { page = 1, perPage = 10 } = req.query;

	try {
		// Autorizzazione: solo l'utente stesso può vedere le sue recensioni, o un admin
		if (paramUserId !== authenticatedUserId.toString() && role !== "admin") {
			return responseReturn(res, 403, {
				error: "Non autorizzato a visualizzare queste recensioni.",
			});
		}

		if (!mongoose.Types.ObjectId.isValid(paramUserId)) {
			return responseReturn(res, 400, {
				error: "ID Utente non valido.",
			});
		}

		const pageNum = parseInt(page, 10);
		const limit = parseInt(perPage, 10);
		const skip = (pageNum - 1) * limit;

		const reviews = await Review.find({ user: paramUserId })
			.populate("product", "name slug imageUrls") // Popola solo i campi essenziali del prodotto
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const totalReviews = await Review.countDocuments({ user: paramUserId });

		responseReturn(res, 200, { reviews, totalReviews });
	} catch (error) {
		console.error("Errore nel recupero delle recensioni dell'utente:", error);
		responseReturn(res, 500, {
			error:
				"Errore interno del server durante il recupero delle recensioni dell'utente.",
		});
	}
};
