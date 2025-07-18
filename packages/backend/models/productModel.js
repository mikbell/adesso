import { Schema, model } from "mongoose";

const productSchema = new Schema(
	{
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
		},

		category: {
			type: String,
			required: [true, "La categoria è obbligatoria."],
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
	},
	{
		timestamps: true,
	}
);

productSchema.index({ name: "text", category: "text", description: "text" });

const Product = model("Product", productSchema);
export default Product;
