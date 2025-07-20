import { Router } from "express";
import {
	getSellersForChat,
	getMessages,
	sendMessage,
	getCustomersForSeller,
	sellerSendMessage,
} from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const chatRouter = Router();

// Tutte le rotte sono protette e accessibili solo agli admin
chatRouter.get("/sellers", authMiddleware, adminMiddleware, getSellersForChat);
chatRouter.get(
	"/messages/:sellerId",
	authMiddleware,
	adminMiddleware,
	getMessages
);
chatRouter.post("/send-message", authMiddleware, adminMiddleware, sendMessage);

chatRouter.get(
	"/customers/:sellerId",
	authMiddleware,
	adminMiddleware,
	getCustomersForSeller
);
chatRouter.post(
	"/seller-send-message",
	authMiddleware,
	adminMiddleware,
	sellerSendMessage
);
export default chatRouter;
