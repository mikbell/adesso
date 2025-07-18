import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // -> Importa direttamente jsonwebtoken
import User from "../models/userModel.js";
import { responseReturn } from "../utils/response.js";

const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: "none",
	secure: true,
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select("+password");
		// Se l'utente non esiste o la password è errata, restituisci un errore generico
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return responseReturn(res, 401, {
				error: "Email o password non corretti.",
			});
		}

		// Il login ha successo, crea il token con il ruolo trovato nel DB
		const tokenPayload = { id: user._id, name: user.name, role: user.role };
		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		res.cookie("authToken", token, COOKIE_OPTIONS);
		responseReturn(res, 200, {
			message: "Login effettuato con successo",
			userInfo: tokenPayload,
		});
	} catch (error) {
		console.error("Errore durante il login:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

export const register = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		if (await User.findOne({ email })) {
			return responseReturn(res, 409, {
				error: "Un utente con questa email esiste già.",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: "seller",
		});

		const tokenPayload = { id: user._id, name: user.name, role: user.role };

		// ▼▼▼ MODIFICA CHIAVE ▼▼▼
		// Crea il token usando direttamente jwt.sign anche qui
		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		res.cookie("authToken", token, COOKIE_OPTIONS);
		responseReturn(res, 201, {
			message: "Registrazione completata",
			userInfo: tokenPayload,
		});
	} catch (error) {
		console.error("Errore durante la registrazione:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

export const logout = (req, res) => {
	try {
		res.clearCookie("authToken", COOKIE_OPTIONS);
		responseReturn(res, 200, { message: "Logout avvenuto con successo." });
	} catch (error) {
		console.error("Errore durante il logout:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};
