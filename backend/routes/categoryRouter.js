import router from "express";
import {
	getCategories,
	addCategory,
	deleteCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const categoryRouter = router();

categoryRouter.get("/get", authMiddleware, getCategories);
categoryRouter.post("/add", authMiddleware, addCategory);
categoryRouter.delete("/delete/:categoryId", authMiddleware, deleteCategory);

export default categoryRouter;
