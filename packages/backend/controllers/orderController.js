import Order from "../models/orderModel.js";
import { responseReturn } from "../utils/response.js";
import { v4 as uuidv4 } from "uuid";

export const getOrders = async (req, res) => {
	const { page = 1, perPage = 10, search = "", status = "" } = req.query;
	try {
		const pageNum = parseInt(page);
		const limit = parseInt(perPage);
		const skip = (pageNum - 1) * limit;

		const queryOptions = {};
		if (search) {
			queryOptions["$or"] = [
				{ orderId: { $regex: search, $options: "i" } },
				{ customerName: { $regex: search, $options: "i" } },
			];
		}
		if (status) {
			queryOptions.status = status;
		}

		const orders = await Order.find(queryOptions)
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });
		const totalOrders = await Order.countDocuments(queryOptions);

		responseReturn(res, 200, { orders, totalOrders });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero degli ordini" });
	}
};

export const createOrder = async (req, res) => {
	try {
		// Estrai i dati dal corpo della richiesta (inviati dal frontend)
		const { shippingInfo, cartItems, total } = req.body;

		// Estrai i dati del cliente dall'oggetto shippingInfo
		// Combiniamo nome e cognome per il campo customerName
		const customerName = `${shippingInfo.name} ${shippingInfo.lastName}`;

		// Genera un ID ordine univoco. Non dovresti affidarti al frontend per questo.
		const orderId = uuidv4();

		// Crea un nuovo documento ordine con Mongoose
		const newOrder = new Order({
			customerName: customerName,
			customerEmail: shippingInfo.email,
			shippingAddress: {
				address: shippingInfo.address,
				city: shippingInfo.city,
				postalCode: shippingInfo.postalCode,
				// Aggiungi altri campi se presenti nel tuo schema
			},
			totalAmount: total,
			orderId: orderId, // Usa l'ID generato
			// Altri campi richiesti dal tuo schema, ad esempio:
			items: cartItems.map((item) => ({
				product: item.productId,
				quantity: item.quantity,
				price: item.price,
			})),
			// ... altri campi come paymentInfo, status, ecc.
		});

		// Salva l'ordine nel database
		const savedOrder = await newOrder.save();

		res.status(201).json({
			message: "Ordine creato con successo!",
			order: savedOrder,
		});
	} catch (error) {
		console.error("Errore durante la creazione dell'ordine:", error);

		// Se l'errore è un errore di validazione Mongoose, invia un messaggio specifico
		if (error.name === "ValidationError") {
			return res.status(400).json({ error: error.message });
		}

		// Altrimenti, invia un errore generico
		res.status(500).json({ error: "Errore interno del server" });
	}
};
export const updateOrderStatus = async (req, res) => {
	const { orderId } = req.params;
	const { status } = req.body;
	try {
		const order = await Order.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true }
		);
		if (!order) {
			return responseReturn(res, 404, { error: "Ordine non trovato." });
		}
		responseReturn(res, 200, { message: "Stato ordine aggiornato." });
	} catch (error) {
		responseReturn(res, 500, {
			error: "Errore durante l'aggiornamento dello stato.",
		});
	}
};
/**
 * @description Recupera i dettagli di un singolo ordine tramite ID.
 */
export const getOrderDetails = async (req, res) => {
	const { orderId } = req.params;
	try {
		// Usiamo .populate() per ottenere anche i dettagli dell'utente (se necessario in futuro)
		const order = await Order.findById(orderId).populate(
			"customerId",
			"name email"
		);

		if (!order) {
			return responseReturn(res, 404, { error: "Ordine non trovato." });
		}
		responseReturn(res, 200, { orderDetails: order });
	} catch (error) {
		responseReturn(res, 500, {
			error: "Errore nel recupero dei dettagli dell'ordine.",
		});
	}
};
