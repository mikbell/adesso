// routes/authRouter.js
import { Router } from "express";
import {
	customerLogin,
	customerRegister,
	sellerLogin,
	sellerRegister,
	adminLogin,
	adminRegister,
	logout,
} from "../controllers/authController.js";

const authRouter = Router();

// Rotte pubbliche per l'autenticazione
authRouter.post("/customer-login", customerLogin);
authRouter.post("/customer-register", customerRegister);
authRouter.post("/seller-login", sellerLogin);
authRouter.post("/seller-register", sellerRegister);
authRouter.post("/admin-login", adminLogin);
authRouter.post("/admin-register", adminRegister);
authRouter.post("/logout", logout);

export default authRouter;
