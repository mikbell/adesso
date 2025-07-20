import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { responseReturn } from "../utils/response.js";

export const getSellerDashboardData = async (req, res) => {
	const sellerId = req.id; // ID del venditore loggato

	try {
		// Calcola le statistiche
		const totalSales = await Order.aggregate([
			{ $match: { sellerId: sellerId, status: "delivered" } },
			{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
		]);
		const totalProducts = await Product.countDocuments({ sellerId });
		const totalOrders = await Order.countDocuments({ sellerId });
		const pendingOrders = await Order.countDocuments({
			sellerId,
			status: "pending",
		});

		// Recupera gli ordini recenti
		const recentOrders = await Order.find({ sellerId })
			.sort({ createdAt: -1 })
			.limit(5);

		// In un'app reale, qui recupereresti anche i messaggi recenti
		const recentMessages = []; // Placeholder

		const dashboardData = {
			totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
			totalProducts,
			totalOrders,
			pendingOrders,
			recentOrders,
			recentMessages,
		};

		responseReturn(res, 200, { dashboardData });
	} catch (error) {
		responseReturn(res, 500, {
			error: "Errore nel recupero dei dati della dashboard",
		});
	}
};
