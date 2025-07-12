import { Router } from "express";
import {
	getPaymentRequests,
	confirmPaymentRequest,
} from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const paymentRouter = Router();

// Entrambe le rotte sono protette e accessibili solo agli admin
paymentRouter.get("/", authMiddleware, adminMiddleware, getPaymentRequests);
paymentRouter.patch(
	"/:paymentId/confirm",
	authMiddleware,
	adminMiddleware,
	confirmPaymentRequest
);

export default paymentRouter;
