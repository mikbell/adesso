// routes/authRouter.js
import { Router } from "express";
import {
	login,
	register,
	logout,
} from "../controllers/authController.js";

const authRouter = Router();

// Rotte pubbliche per l'autenticazione
authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);

export default authRouter;
