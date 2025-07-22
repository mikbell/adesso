import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product", // Riferimento al modello Product
			required: [true, "La recensione deve appartenere a un prodotto."],
			index: true, // Ottimo per le query che filtrano per prodotto
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User", // Riferimento al modello User (presuppone che tu abbia un modello User)
			required: [true, "La recensione deve appartenere a un utente."],
			index: true, // Ottimo per trovare recensioni di un utente specifico
		},
		rating: {
			type: Number,
			required: [true, "Il rating è obbligatorio."],
			min: [1, "Il rating deve essere almeno 1 stella."],
			max: [5, "Il rating non può superare le 5 stelle."],
		},
		comment: {
			type: String,
			trim: true,
			maxlength: [500, "Il commento non può superare i 500 caratteri."],
		},
		// Potresti voler aggiungere un titolo per la recensione
		title: {
			type: String,
			trim: true,
			maxlength: [100, "Il titolo non può superare i 100 caratteri."],
		},
	},
	{
		timestamps: true, // Aggiunge createdAt e updatedAt
	}
);

// --- Middleware per aggiornare averageRating e numReviews nel prodotto ---
// Questo middleware si attiva *dopo* che una recensione viene salvata o rimossa.
// È un modo efficiente per mantenere i campi del prodotto aggiornati.

// Middleware per POST-SAVE (creazione e aggiornamento di una recensione)
reviewSchema.post("save", async function () {
	// 'this' si riferisce al documento Review appena salvato/modificato
	const productId = this.product;

	try {
		// Aggiorna il rating medio e il numero di recensioni del prodotto
		const stats = await this.constructor.aggregate([
			{ $match: { product: productId } }, // Filtra per il prodotto specifico
			{
				$group: {
					_id: "$product", // Raggruppa per ID del prodotto
					nRating: { $sum: 1 }, // Conta il numero di recensioni
					avgRating: { $avg: "$rating" }, // Calcola la media dei rating
				},
			},
		]);

		if (stats.length > 0) {
			await model("Product").findByIdAndUpdate(productId, {
				averageRating: stats[0].avgRating,
				numReviews: stats[0].nRating,
			});
		} else {
			// Se non ci sono più recensioni (es. l'ultima è stata eliminata), resetta
			await model("Product").findByIdAndUpdate(productId, {
				averageRating: 0,
				numReviews: 0,
			});
		}
	} catch (error) {
		console.error("Errore nel middleware post-save della recensione:", error);
		// Considera come gestire l'errore: loggarlo, inviare notifica, ecc.
	}
});

// Middleware per POST-DELETE (eliminazione di una recensione)
reviewSchema.post("findOneAndDelete", async function (doc) {
	// 'doc' si riferisce al documento Review che è stato eliminato
	if (doc) {
		// Assicurati che un documento sia stato effettivamente eliminato
		const productId = doc.product;

		try {
			const stats = await model("Review").aggregate([
				{ $match: { product: productId } },
				{
					$group: {
						_id: "$product",
						nRating: { $sum: 1 },
						avgRating: { $avg: "$rating" },
					},
				},
			]);

			if (stats.length > 0) {
				await model("Product").findByIdAndUpdate(productId, {
					averageRating: stats[0].avgRating,
					numReviews: stats[0].nRating,
				});
			} else {
				// Se non ci sono più recensioni per il prodotto, resetta
				await model("Product").findByIdAndUpdate(productId, {
					averageRating: 0,
					numReviews: 0,
				});
			}
		} catch (error) {
			console.error(
				"Errore nel middleware post-delete della recensione:",
				error
			);
		}
	}
});

const Review = model("Review", reviewSchema);

export default Review;
