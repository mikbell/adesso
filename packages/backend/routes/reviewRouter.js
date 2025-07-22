// Esempio in routes/reviewRoutes.js (dopo aver configurato Express e il middleware di auth)
import { Router } from "express";
import {
	addReview,
	getProductReviews,
	getReview,
	updateReview,
	deleteReview,
	getUserReviews,
} from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Assumi che tu abbia questi middleware

const reviewRouter = Router();

reviewRouter.route("/products/:productId/reviews").post(authMiddleware, addReview); // Solo utenti autenticati possono aggiungere recensioni

reviewRouter.route("/products/:productId/reviews").get(getProductReviews); // Tutti possono vedere le recensioni di un prodotto

reviewRouter.route("/user/:userId").get(authMiddleware, getUserReviews); // Solo l'utente o un admin può vedere le sue recensioni

reviewRouter
	.route("/:reviewId")
	.get(getReview)
	.put(authMiddleware, updateReview) // Solo l'utente che l'ha creata o un admin può aggiornare
	.delete(authMiddleware, deleteReview); // Solo l'utente che l'ha creata o un admin può eliminare

export default reviewRouter;