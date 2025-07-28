import { Router } from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// Collega le funzioni del controller alle rotte specifiche
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.put("/update-quantity", authMiddleware, updateQuantity);
router.delete("/clear", authMiddleware, clearCart);

export default router;
