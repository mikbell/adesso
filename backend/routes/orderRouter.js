import { Router } from "express";
import {
	getOrders,
	updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const orderRouter = Router();

orderRouter.get("/", authMiddleware, getOrders);
orderRouter.patch("/:orderId/status", authMiddleware, updateOrderStatus);

export default orderRouter;
