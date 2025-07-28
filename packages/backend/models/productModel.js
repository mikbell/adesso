import { Schema, model } from "mongoose";

const productSchema = new Schema(
	{
		seller: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		
		name: {
			type: String,
			required: [true, "Il nome del prodotto è obbligatorio."],
			trim: true,
		},

		brand: {
			type: String,
			trim: true,
		},

		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},

		description: {
			type: String,
			trim: true,
		},

		price: {
			type: Number,
			required: [true, "Il prezzo è obbligatorio."],
			min: [0, "Il prezzo non può essere negativo."],
		},

		discount: {
			type: Number,
			default: 0,
			min: [0, "Lo sconto non può essere negativo."],
			max: [100, "Lo sconto non può superare il 100%."],
		},

		stock: {
			type: Number,
			required: [true, "La quantità in stock è obbligatoria."],
			default: 0,
			min: [0, "Lo stock non può essere negativo."],
		},

		sku: {
			type: String,
			trim: true,
			unique: true, // SKUs dovrebbero essere unici
			sparse: true, // Permette più documenti con SKU null (se non tutti i prodotti ne hanno uno)
		},

		category: {
			type: String, // Considera Schema.Types.ObjectId se hai un modello Category
			required: [true, "La categoria è obbligatoria."],
			trim: true,
		},

		status: {
			type: String,
			enum: ["draft", "published", "archived"],
			default: "draft",
		},

		images: [
			{
				url: {
					type: String,
					required: true,
				},
				public_id: {
					type: String,
					required: true,
				},
			},
		],

		// --- Nuovi campi o miglioramenti ---

		// Campi per il rating medio (aggiornati tramite logica applicativa)
		averageRating: {
			type: Number,
			default: 0,
			min: [0, "Il rating non può essere negativo."],
			max: [5, "Il rating non può superare 5."],
			set: (v) => Math.round(v * 10) / 10, // Arrotonda a un decimale
		},
		numReviews: {
			type: Number,
			default: 0,
			min: [0, "Il numero di recensioni non può essere negativo."],
		},

		// Dettagli di spedizione/dimensioni
		weight: {
			type: Number,
			min: [0, "Il peso non può essere negativo."],
			default: 0,
		},
		weightUnit: {
			type: String,
			enum: ["kg", "g", "lb", "oz"],
			default: "kg",
		},

		// Informazioni per SEO
		metaTitle: {
			type: String,
			trim: true,
			maxlength: [70, "Il meta titolo non può superare i 70 caratteri."],
		},
		metaDescription: {
			type: String,
			trim: true,
			maxlength: [160, "La meta descrizione non può superare i 160 caratteri."],
		},

		// --- Campi esistenti ---
		relatedProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],

		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
	},
	{
		timestamps: true,
	}
);

// Indice per la ricerca full-text
productSchema.index({
	name: "text",
	category: "text",
	description: "text",
	brand: "text",
});
// Indice per price e category per filtri e ordinamenti comuni
productSchema.index({ price: 1, category: 1 });

const Product = model("Product", productSchema);
export default Product;
