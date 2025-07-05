import bcrypt from "bcrypt";
// 'jsonwebtoken' non era utilizzato, quindi è stato rimosso per pulizia.
import Admin from "../models/adminModel.js";
import Seller from "../models/sellerModel.js";
import SellerCustomer from "../models/chat/sellerCustomerModel.js";
import { responseReturn } from "../utils/response.js";
import { createToken } from "../utils/token.js";

// --- COSTANTI ---
// Centralizzare le impostazioni dei cookie e la durata del token previene errori e facilita le modifiche.
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE_OPTIONS = {
	expires: new Date(Date.now() + SEVEN_DAYS_IN_MS),
	httpOnly: true, // Impedisce l'accesso al cookie tramite JavaScript nel client (protezione da XSS)
	secure: true, // Invia il cookie solo su connessioni HTTPS
	sameSite: "none", // Necessario per le richieste cross-site (es. API su dominio diverso dal frontend)
};

/**
 * @description Gestisce il login di un venditore.
 * @param {object} req - Oggetto della richiesta Express.
 * @param {object} res - Oggetto della risposta Express.
 */
export const sellerLogin = async (req, res) => {
	const { email, password } = req.body;

	// Validazione base dell'input
	if (!email || !password) {
		return responseReturn(res, 400, {
			error: "Email e password sono obbligatori.",
		});
	}

	try {
		const seller = await Seller.findOne({ email }).select("+password");

		// Per sicurezza, si usa un messaggio di errore generico per non rivelare se un utente esiste o meno.
		if (!seller) {
			return responseReturn(res, 401, { error: "Credenziali non valide." });
		}

		const isMatch = await bcrypt.compare(password, seller.password);

		if (!isMatch) {
			return responseReturn(res, 401, { error: "Credenziali non valide." });
		}

		// Creazione del token con ID e ruolo per una gestione autorizzazioni più flessibile.
		const token = createToken({ id: seller._id, role: seller.role });

		// Imposta il cookie con opzioni standardizzate e sicure.
		res.cookie("token", token, COOKIE_OPTIONS);

		// Invia una risposta di successo con il token e le informazioni essenziali dell'utente.
		responseReturn(res, 200, {
			message: "Login effettuato con successo.",
			token,
			userInfo: {
				id: seller._id,
				name: seller.name,
				email: seller.email,
				role: seller.role,
			},
		});
	} catch (error) {
		console.error("Errore in sellerLogin:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante il login.",
		});
	}
};

/**
 * @description Gestisce la registrazione di un nuovo venditore.
 * @param {object} req - Oggetto della richiesta Express.
 * @param {object} res - Oggetto della risposta Express.
 */
export const sellerRegister = async (req, res) => {
	const { name, email, password } = req.body;

	// Validazione dell'input
	if (!name || !email || !password) {
		return responseReturn(res, 400, {
			error: "Nome, email e password sono obbligatori.",
		});
	}

	try {
		const existingSeller = await Seller.findOne({ email });
		if (existingSeller) {
			return responseReturn(res, 409, {
				error: "Un utente con questa email esiste già.",
			}); // 409 Conflict è più appropriato
		}

		// L'hashing della password viene fatto in un unico passaggio per semplicità.
		const hashedPassword = await bcrypt.hash(password, 10);

		const newSeller = await Seller.create({
			name,
			email,
			password: hashedPassword,
			method: "email",
			// È buona pratica definire valori di default nel modello Mongoose piuttosto che qui,
			// ma li manteniamo per coerenza con il codice originale.
			image: "",
			shopInfo: {},
		});

		// Crea il documento associato per la chat. Se fallisce, la registrazione utente è avvenuta comunque.
		// Per una maggiore robustezza, si potrebbe implementare una transazione di database.
		await SellerCustomer.create({
			sellerId: newSeller._id,
			customers: [],
		});

		const token = createToken({ id: newSeller._id, role: newSeller.role });

		res.cookie("token", token, COOKIE_OPTIONS);

		responseReturn(res, 201, {
			// 201 Created è lo status code corretto per una nuova risorsa.
			message: "Registrazione avvenuta con successo.",
			token,
			userInfo: {
				id: newSeller._id,
				name: newSeller.name,
				email: newSeller.email,
				role: newSeller.role,
			},
		});
	} catch (error) {
		console.error("Errore in sellerRegister:", error);
		responseReturn(res, 500, {
			error: "Errore interno del server durante la registrazione.",
		});
	}
};

/**
 * @description Gestisce il login di un amministratore.
 * @param {object} req - Oggetto della richiesta Express.
 * @param {object} res - Oggetto della risposta Express.
 */
export const adminLogin = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return responseReturn(res, 400, {
			error: "Email e password sono obbligatori.",
		});
	}

	try {
		const admin = await Admin.findOne({ email }).select("+password");

		if (!admin) {
			return responseReturn(res, 401, { error: "Credenziali non valide." });
		}

		const isMatch = await bcrypt.compare(password, admin.password);

		if (!isMatch) {
			return responseReturn(res, 401, { error: "Credenziali non valide." });
		}

		const token = createToken({ id: admin._id, role: admin.role });

		res.cookie("token", token, COOKIE_OPTIONS);

		responseReturn(res, 200, {
			message: "Login avvenuto con successo.",
			token,
			userInfo: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
			},
		});
	} catch (error) {
		console.error("Errore in adminLogin:", error);
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Recupera le informazioni dell'utente loggato (admin o seller) basandosi sui dati nel token.
 * @param {object} req - Oggetto della richiesta Express (dovrebbe contenere `id` e `role` dal middleware del token).
 * @param {object} res - Oggetto della risposta Express.
 */
export const getUser = async (req, res) => {
	// Si presume che un middleware abbia già validato il token e aggiunto id/role a `req`.
	const { id, role } = req;

	if (!id || !role) {
		return responseReturn(res, 401, { error: "Token non valido o mancante." });
	}

	try {
		let user;
		if (role === "admin") {
			user = await Admin.findById(id);
		} else if (role === "seller") {
			user = await Seller.findById(id);
		} else {
			return responseReturn(res, 400, {
				error: "Ruolo non valido specificato nel token.",
			});
		}

		if (!user) {
			return responseReturn(res, 404, { error: "Utente non trovato." });
		}

		// Rimuoviamo la password per sicurezza, anche se non dovrebbe essere selezionata.
		const { password, ...userInfo } = user.toObject();

		return responseReturn(res, 200, { userInfo });
	} catch (error) {
		console.error("Errore in getUser:", error);
		return responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token", COOKIE_OPTIONS);
	responseReturn(res, 200, { message: "Logout avvenuto con successo." });
};