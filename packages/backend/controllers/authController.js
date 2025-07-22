import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Assicurati che il tuo modello User gestisca i ruoli
import { responseReturn } from "../utils/response.js";

// Opzioni per i cookie, assicurati che siano appropriate per il tuo ambiente (sviluppo/produzione)
const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: "none", // 'None' richiede 'secure: true'
	secure: true, // Solo su HTTPS in produzione
	maxAge: 24 * 60 * 60 * 1000, // 24 ore
};

// Funzione helper per generare il token JWT e impostare il cookie
const generateTokenAndSetCookie = (user, res, message, statusCode) => {
	const tokenPayload = { id: user._id, name: user.name, role: user.role };
	const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
		expiresIn: "24h",
	});

	res.cookie("authToken", token, COOKIE_OPTIONS);
	responseReturn(res, statusCode, {
		message,
		userInfo: tokenPayload,
	});
};

// --- CONTROLLORI DI LOGIN ---

/**
 * @description Login per i clienti (role: 'customer')
 */
export const customerLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return responseReturn(res, 401, {
				error: "Email o password non corretti.",
			});
		}

		// Verifica che l'utente abbia il ruolo 'customer'
		if (user.role !== "customer") {
			return responseReturn(res, 403, {
				error: "Accesso negato. Non sei un cliente.",
			});
		}

		generateTokenAndSetCookie(
			user,
			res,
			"Login cliente effettuato con successo",
			200
		);
	} catch (error) {
		console.error("Errore durante il login del cliente:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Login per i venditori (role: 'seller')
 */
export const sellerLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return responseReturn(res, 401, {
				error: "Email o password non corretti.",
			});
		}

		// Verifica che l'utente abbia il ruolo 'seller'
		if (user.role !== "seller") {
			return responseReturn(res, 403, {
				error: "Accesso negato. Non sei un venditore.",
			});
		}

		generateTokenAndSetCookie(
			user,
			res,
			"Login venditore effettuato con successo",
			200
		);
	} catch (error) {
		console.error("Errore durante il login del venditore:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Login per gli amministratori (role: 'admin')
 */
export const adminLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return responseReturn(res, 401, {
				error: "Email o password non corretti.",
			});
		}

		// Verifica che l'utente abbia il ruolo 'admin'
		if (user.role !== "admin") {
			return responseReturn(res, 403, {
				error: "Accesso negato. Non sei un amministratore.",
			});
		}

		generateTokenAndSetCookie(
			user,
			res,
			"Login amministratore effettuato con successo",
			200
		);
	} catch (error) {
		console.error("Errore durante il login dell'amministratore:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

// --- CONTROLLORI DI REGISTRAZIONE ---

/**
 * @description Registrazione per i clienti (role: 'customer')
 */
export const customerRegister = async (req, res) => {
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
			role: "customer", // Ruolo fisso per la registrazione cliente
		});

		generateTokenAndSetCookie(
			user,
			res,
			"Registrazione cliente completata",
			201
		);
	} catch (error) {
		console.error("Errore durante la registrazione del cliente:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Registrazione per i venditori (role: 'seller')
 * Potrebbe includere campi aggiuntivi come 'shopName', 'address', ecc.
 */
export const sellerRegister = async (req, res) => {
	const { name, email, password, shopName, address } = req.body; // Esempio di campi aggiuntivi
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
			role: "seller", // Ruolo fisso per la registrazione venditore
			shopName, // Salva il nome del negozio
			address, // Salva l'indirizzo
			// Aggiungi altri campi specifici per il venditore se il tuo modello User li supporta
		});

		generateTokenAndSetCookie(
			user,
			res,
			"Registrazione venditore completata",
			201
		);
	} catch (error) {
		console.error("Errore durante la registrazione del venditore:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Registrazione per gli amministratori (role: 'admin')
 * Nota: La registrazione di un admin dovrebbe essere un processo molto più controllato,
 * non esposta tramite una rotta pubblica in produzione. Spesso viene fatta manualmente
 * o tramite una rotta protetta da un admin esistente.
 */
export const adminRegister = async (req, res) => {
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
			role: "admin", // Ruolo fisso per la registrazione amministratore
		});

		generateTokenAndSetCookie(
			user,
			res,
			"Registrazione amministratore completata",
			201
		);
	} catch (error) {
		console.error(
			"Errore durante la registrazione dell'amministratore:",
			error
		);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

// --- CONTROLLORE DI LOGOUT ---

/**
 * @description Logout unificato per tutti i tipi di utente.
 */
export const logout = (req, res) => {
	try {
		res.clearCookie("authToken", COOKIE_OPTIONS);
		responseReturn(res, 200, { message: "Logout avvenuto con successo." });
	} catch (error) {
		console.error("Errore durante il logout:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};
