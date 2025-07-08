import router from "express";
import {
	getCategories,
	addCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const categoryRouter = router();

categoryRouter.post("/categories/get", authMiddleware, getCategories);
categoryRouter.post("/categories/add", authMiddleware, addCategory);

export default categoryRouter;
