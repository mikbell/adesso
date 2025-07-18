import Order from "../models/orderModel.js";
import { responseReturn } from "../utils/response.js";

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
