import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import { responseReturn } from "../utils/response.js";
import { createToken } from "../utils/token.js";

export const login = async (req, res) => {};
export const register = async (req, res) => {};

export const adminLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const admin = await Admin.findOne({ email }).select("+password");

		if (!admin) {
			return responseReturn(res, 401, { error: "Credenziali non valide" });
		}

		const match = await bcrypt.compare(password, admin.password);

		console.log(match);

		if (match) {
			const token = await createToken({ id: admin._id, role: admin.role });

			res.cookie("token", token, {
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				httpOnly: true,
				secure: true,
				sameSite: "none",
			});

			return responseReturn(res, 200, {
				message: "Login avvenuto con successo",
				token: token,
				admin: {
					id: admin._id,
					email: admin.email,
				},
			});
		} else {
			return responseReturn(res, 401, { message: "Credenziali non valide" });
		}
	} catch (error) {
		console.error("Errore in adminLogin:", error);
		return responseReturn(res, 500, { message: "Errore interno del server." });
	}
};

export const getUser = async (req, res) => {
	const { id, role } = req;
	try {
		if (role === "admin") {
			const user = await Admin.findById(id);
			return responseReturn(res, 200, { userInfo: user });
		}else{
            console.log('Info venditore')
        }
	} catch (error) {
		console.error("Errore in getUser:", error);
		return responseReturn(res, 500, { message: "Errore interno del server." });
	}
};
