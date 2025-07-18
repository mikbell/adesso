import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		// --- Informazioni di Base e Autenticazione ---
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["admin", "seller", "buyer"],
			required: true,
		},
		status: {
			type: String,
			default: "pending",
		},
		avatarUrl: {
			type: String,
			default: "/images/avatar.jpg",
		},
		avatarPublicId: {
			type: String,
		},

		// --- Dati del Negozio ---
		storeName: {
			type: String,
			trim: true,
		},
		storeDescription: {
			type: String,
			trim: true,
		},
		vatNumber: {
			// Partita IVA
			type: String,
			trim: true,
		},

		// --- Informazioni di Contatto ---
		phone: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
		},
		region: {
			type: String,
		},
		city: {
			type: String,
		},

		// --- Dati e Statistiche Aggiuntive ---
		stats: {
			totalSales: { type: Number, default: 0 },
			productsListed: { type: Number, default: 0 },
			averageRating: { type: Number, default: 0 },
		},

		settings: {
			notifications: {
				newOrders: { type: Boolean, default: true },
				newMessages: { type: Boolean, default: true },
			},
		},
	},
	{
		timestamps: true,
	}
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
