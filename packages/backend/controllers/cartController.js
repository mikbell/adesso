import Cart from "../models/cartModel.js"; // Assicurati che il percorso sia corretto
import Product from "../models/productModel.js"; // Assicurati che il percorso sia corretto

// --- Funzioni del Controller ---

// @desc    Ottieni il carrello dell'utente autenticato
// @route   GET /api/cart
// @access  Privato
export const getCart = async (req, res) => {
	try {
		const userId = req.id; // L'ID utente viene dal middleware di autenticazione
		let cart = await Cart.findOne({ userId: userId }).populate(
			"items.productId"
		); // Popola i dettagli del prodotto

		if (!cart) {
			// Se il carrello non esiste, ne crea uno vuoto
			// Questo gestisce il caso in cui un utente loggato non ha ancora un carrello.
			// Il carrello vuoto verrà restituito.
			cart = await Cart.create({ userId: userId, items: [] });
			// Non è necessario ri-popolare qui, dato che è appena stato creato vuoto
		}

		// Formatta la risposta per il frontend
		res.status(200).json({
			cartItems: cart.items,
			total: cart.subtotal, // Usa subtotal dal modello
			quantity: cart.totalQuantity, // Usa totalQuantity dal modello
		});
	} catch (error) {
		console.error("Errore nel recupero del carrello:", error);
		res.status(500).json({ error: "Errore nel recupero del carrello." });
	}
};

// @desc    Aggiungi un prodotto al carrello
// @route   POST /api/cart/add
// @access  Privato
export const addToCart = async (req, res) => {
	const userId = req.id;
	const { productId, quantity } = req.body;

	try {
		if (!productId) {
			return res
				.status(400)
				.json({ error: "ID prodotto non fornito nel corpo della richiesta." });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ error: "Prodotto non trovato." });
		}

		let userCart = await Cart.findOne({ userId: userId });

		// Se il carrello non esiste, creane uno nuovo
		if (!userCart) {
			userCart = new Cart({
				userId: userId, // <-- CORREZIONE QUI: Usa 'userId' come nel modello
				items: [],
				subtotal: 0,
				totalQuantity: 0, // Inizializza anche totalQuantity
			});
		}

		const itemIndex = userCart.items.findIndex(
			(item) => item.productId.toString() === productId // Usa productId come nel CartItemSchema
		);

		if (itemIndex > -1) {
			userCart.items[itemIndex].quantity += quantity;
		} else {
			// CORREZIONE QUI: Usa 'productId' come nel CartItemSchema
			userCart.items.push({
				productId: product._id,
				name: product.name,
				price: product.price,
				image: product.images[0]?.url,
				quantity: quantity,
			});
		}

		await userCart.save(); // Salva le modifiche al carrello

		// Dopo aver salvato, recupera il carrello aggiornato e popolato per inviarlo al frontend
		// Questo assicura che il frontend riceva i dati più recenti e completi
		const updatedCart = await Cart.findOne({ userId: userId }).populate(
			"items.productId"
		);

		res.status(200).json({
			message: "Prodotto aggiunto con successo!",
			cartItems: updatedCart.items,
			total: updatedCart.subtotal,
			quantity: updatedCart.totalQuantity,
		});
	} catch (error) {
		console.error("Errore nell'aggiunta al carrello:", error);
		res.status(500).json({ error: "Errore nell'aggiunta al carrello." });
	}
};

// @desc    Aggiorna la quantità di un prodotto nel carrello
// @route   PUT /api/cart/update-quantity
// @access  Privato
export const updateQuantity = async (req, res) => {
	const userId = req.id;
	const { productId, quantity } = req.body;

	console.log(
		`Richiesta PUT updateQuantity - User ID: ${userId}, Product ID ricevuto dal frontend: ${productId}, New Quantity: ${quantity}`
	);

	try {
		const userCart = await Cart.findOne({ userId: userId }); // Cerca con userId

		if (!userCart) {
			return res.status(404).json({ error: "Carrello non trovato." });
		}

		// CORREZIONE: Cerca la corrispondenza con l'_id del sub-documento del carrello
		const productIndex = userCart.items.findIndex(
			(item) => item._id.toString() === productId
		);

		console.log(
			`Risultato findIndex per il prodotto ${productId}: ${productIndex}`
		);

		if (productIndex === -1) {
			return res
				.status(404)
				.json({ error: "Prodotto non trovato nel carrello." });
		}

		userCart.items[productIndex].quantity = quantity;

		await userCart.save();

		const updatedCart = await Cart.findOne({ userId: userId }).populate(
			"items.productId"
		);

		res.status(200).json({
			message: "Quantità aggiornata con successo!",
			cartItems: updatedCart.items,
			total: updatedCart.subtotal,
			quantity: updatedCart.totalQuantity,
		});
	} catch (error) {
		console.error("Errore nel controller updateQuantity:", error);
		res.status(500).json({ error: "Errore interno del server." });
	}
};

// @desc    Rimuovi un prodotto dal carrello
// @route   DELETE /api/cart/remove/:productId
// @access  Privato
export const removeFromCart = async (req, res) => {
	const userId = req.id;
	const productId = req.params.productId; // Questo è l'_id del sub-documento

	console.log(
		`Richiesta DELETE removeFromCart - User ID: ${userId}, Product ID ricevuto dal frontend: ${productId}`
	);

	try {
		const userCart = await Cart.findOne({ userId: userId }); // Cerca con userId

		if (!userCart) {
			return res.status(404).json({ error: "Carrello non trovato." });
		}

		// CORREZIONE: Filtra basandosi sull'_id del sub-documento dell'articolo nel carrello
		const initialLength = userCart.items.length;
		userCart.items = userCart.items.filter(
			(item) => item._id.toString() !== productId
		);

		if (userCart.items.length === initialLength) {
			return res
				.status(404)
				.json({ error: "Prodotto non trovato nel carrello." });
		}

		await userCart.save();

		const updatedCart = await Cart.findOne({ userId: userId }).populate(
			"items.productId"
		);

		res.status(200).json({
			message: "Prodotto rimosso con successo!",
			cartItems: updatedCart.items,
			total: updatedCart.subtotal,
			quantity: updatedCart.totalQuantity,
		});
	} catch (error) {
		console.error("Errore nella rimozione dal carrello:", error);
		res.status(500).json({ error: "Errore nella rimozione dal carrello." });
	}
};

// @desc    Svuota l'intero carrello
// @route   DELETE /api/cart/clear
// @access  Privato
export const clearCart = async (req, res) => {
	const userId = req.id;
	try {
		const cart = await Cart.findOne({ userId: userId }); // Cerca con userId

		if (!cart) {
			return res.status(404).json({ error: "Carrello non trovato." });
		}

		cart.items = [];
		await cart.save();

		res.status(200).json({
			message: "Carrello svuotato con successo!",
			cartItems: [],
			total: 0,
			quantity: 0,
		});
	} catch (error) {
		console.error("Errore nello svuotare il carrello:", error);
		res.status(500).json({ error: "Errore nello svuotare il carrello." });
	}
};
