import { Router } from "express";
import {
	getOrders,
	updateOrderStatus,
	getOrderDetails,
	createOrder
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const orderRouter = Router();

orderRouter.get("/", authMiddleware, getOrders);
orderRouter.post("/", authMiddleware, createOrder);
orderRouter.patch("/:orderId/status", authMiddleware, updateOrderStatus);
orderRouter.get("/:orderId", authMiddleware, getOrderDetails);

export default orderRouter;
