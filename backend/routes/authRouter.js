import router from "express";
import {
	sellerLogin,
	sellerRegister,
	adminLogin,
	getUser,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = router();

authRouter.post("/seller-login", sellerLogin);
authRouter.post("/seller-register", sellerRegister);
authRouter.post("/admin-login", adminLogin);
authRouter.get("/get-user", authMiddleware, getUser);

export default authRouter;
