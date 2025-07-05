import router from "express";
import {
	login,
	register,
	adminLogin,
	getUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/admin-login", adminLogin);
authRouter.get("/get-user", authMiddleware, getUser);

export default authRouter;
