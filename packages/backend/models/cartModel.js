import mongoose from "mongoose";

// Definizione dello Schema per i singoli articoli del carrello
const CartItemSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product", // Riferimento al modello dei tuoi prodotti
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: false, // L'immagine non è strettamente necessaria, ma utile
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
		min: 1, // Assicura che la quantità sia sempre almeno 1
	},
});

// Definizione dello Schema principale del Carrello
const CartSchema = new mongoose.Schema(
	{
		// L'ID dell'utente a cui appartiene il carrello
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Riferimento al modello del tuo utente
			required: true,
			unique: true, // Un utente può avere un solo carrello
		},
		// Un array di articoli, utilizzando lo schema definito sopra
		items: [CartItemSchema],
		// Dati calcolati per facilitare l'accesso (opzionali, si possono calcolare al momento)
		subtotal: {
			type: Number,
			default: 0,
		},
		totalQuantity: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true, // Aggiunge automaticamente i campi 'createdAt' e 'updatedAt'
	}
);

// Aggiungi un metodo pre-save per calcolare subtotal e totalQuantity prima di salvare
CartSchema.pre("save", function (next) {
	this.subtotal = this.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
	next();
});

// Esportazione del modello
const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
