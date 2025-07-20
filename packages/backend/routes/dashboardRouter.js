import { Router } from "express";
import { getSellerDashboardData } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/seller", authMiddleware, getSellerDashboardData);

export default dashboardRouter;
