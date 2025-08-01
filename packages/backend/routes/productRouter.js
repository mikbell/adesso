import router from "express";
import {
	getProducts,
	addProduct,
	deleteProduct,
	getProduct,
	updateProduct,
	getLatestProducts,
	getDiscountedProducts,
	getTopRatedProducts
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const productRouter = router();

productRouter.get("/get", getProducts);
productRouter.get("/get/:productId", getProduct);
productRouter.post("/add", authMiddleware, addProduct);
productRouter.put("/update/:productId", authMiddleware, updateProduct); // Usiamo PUT per un aggiornamento completo
productRouter.delete("/delete/:categoryId", authMiddleware, deleteProduct);
productRouter.get("/latest", getLatestProducts);
productRouter.get("/discounted", getDiscountedProducts);
productRouter.get("/top-rated", getTopRatedProducts);

export default productRouter;
