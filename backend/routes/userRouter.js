// routes/userRouter.js (Nuovo file)
import { Router } from "express";
import {
	getUserProfile,
	updateUserProfile,
	updateNotificationSettings,
	getUsers,
	getUserById,
	updateUserStatus
} from "../controllers/userController.js"; // Nota: rinomina il controller
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from '../middlewares/adminMiddleware.js';

const userRouter = Router();

// Rotte protette per la gestione del profilo utente
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/profile/update", authMiddleware, updateUserProfile);
userRouter.patch(
	"/profile/notifications",
	authMiddleware,
	updateNotificationSettings
);
userRouter.get('/', authMiddleware, adminMiddleware, getUsers);
userRouter.get("/:userId", authMiddleware, adminMiddleware, getUserById);
userRouter.patch("/:userId/status", authMiddleware, adminMiddleware, updateUserStatus);

export default userRouter;
