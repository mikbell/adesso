import formidable from "formidable";
import cloudinary from "cloudinary";
import User from "../models/userModel.js";
import { responseReturn } from "../utils/response.js";

export const getUserProfile = async (req, res) => {
	// L'ID utente viene fornito dal middleware di autenticazione in req.id
	const { id } = req;

	try {
		const userInfo = await User.findById(id);
		if (!userInfo) {
			return responseReturn(res, 404, { error: "Profilo utente non trovato" });
		}
		responseReturn(res, 200, { userInfo });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore interno del server" });
	}
};

// In controllers/userController.js
export const getUsers = async (req, res) => {
	// Aggiungi 'status' ai parametri che possiamo ricevere
	const {
		page = 1,
		perPage = 10,
		search = "",
		role = "",
		status = "",
	} = req.query;
	try {
		const queryOptions = {};
		if (search) {
			queryOptions.name = { $regex: search, $options: "i" };
		}
		if (role) {
			queryOptions.role = role;
		}
		// -> NUOVA LOGICA MIGLIORATA
		// Se la stringa 'status' esiste e non è vuota...
		if (status) {
			// ...la dividiamo in un array e usiamo l'operatore $in di MongoDB
			// per trovare tutti i documenti il cui stato è in quell'array.
			queryOptions.status = { $in: status.split(",") };
		}

		const users = await User.find(queryOptions)
			.skip(/*...*/)
			.limit(/*...*/)
			.sort({ createdAt: -1 });
		const totalUsers = await User.countDocuments(queryOptions);

		responseReturn(res, 200, { users, totalUsers });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero degli utenti" });
	}
};

/**
 * @description Un admin recupera i dettagli di un singolo utente tramite ID.
 */
export const getUserById = async (req, res) => {
	const { userId } = req.params;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return responseReturn(res, 404, { error: "Utente non trovato." });
		}
		responseReturn(res, 200, { userDetails: user });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore interno del server." });
	}
};

/**
 * @description Un admin aggiorna lo stato di un utente (es. da 'pending' a 'active').
 */
export const updateUserStatus = async (req, res) => {
	const { userId } = req.params;
	const { status } = req.body; // Es. { status: 'active' }

	try {
		const user = await User.findByIdAndUpdate(
			userId,
			{ status },
			{ new: true }
		);
		if (!user) {
			return responseReturn(res, 404, { error: "Utente non trovato." });
		}
		responseReturn(res, 200, {
			userDetails: user,
			message: "Stato utente aggiornato con successo.",
		});
	} catch (error) {
		responseReturn(res, 500, {
			error: "Errore durante l'aggiornamento dello stato.",
		});
	}
};

export const updateUserProfile = async (req, res) => {
	const { id } = req;
	const form = formidable();

	try {
		const [fields, files] = await form.parse(req);
		const { name, phone, address, storeName, storeDescription } = fields;
		const { newAvatar } = files;

		const user = await User.findById(id);
		if (!user) {
			return responseReturn(res, 404, { error: "Utente non trovato" });
		}

		// Se viene caricato un nuovo avatar
		if (newAvatar?.[0]) {
			// Se l'utente ha già un avatar personalizzato, eliminalo prima da Cloudinary
			if (user.avatarPublicId) {
				await cloudinary.v2.uploader.destroy(user.avatarPublicId);
			}
			// Carica il nuovo avatar
			const result = await cloudinary.v2.uploader.upload(
				newAvatar[0].filepath,
				{
					folder: "avatars",
				}
			);
			user.avatarUrl = result.secure_url;
			user.avatarPublicId = result.public_id;
		}

		// Aggiorna i campi del documento con i nuovi dati
		user.name = name[0] || user.name;
		user.phone = phone[0] || user.phone;
		user.address = address[0] || user.address;
		user.storeName = storeName[0] || user.storeName;
		user.storeDescription = storeDescription[0] || user.storeDescription;

		const updatedProfile = await user.save();

		responseReturn(res, 200, {
			profile: updatedProfile,
			message: "Profilo aggiornato con successo!",
		});
	} catch (error) {
		console.error("Errore durante l'aggiornamento del profilo:", error);
		responseReturn(res, 500, {
			error: "Errore del server durante l'aggiornamento",
		});
	}
};

/**
 * @description Aggiorna una specifica impostazione di notifica per l'utente.
 */
export const updateNotificationSettings = async (req, res) => {
	const { id } = req;
	// Dati inviati come JSON: { setting: 'newOrders', value: false }
	const { setting, value } = req.body;

	if (typeof value !== "boolean") {
		return responseReturn(res, 400, {
			error: "Il valore dell'impostazione non è valido.",
		});
	}

	try {
		const user = await User.findById(id);
		if (!user) {
			return responseReturn(res, 404, { error: "Utente non trovato" });
		}

		// Aggiorna dinamicamente la chiave nell'oggetto delle notifiche
		if (user.settings?.notifications?.hasOwnProperty(setting)) {
			user.settings.notifications[setting] = value;
		} else {
			return responseReturn(res, 400, { error: "Impostazione non valida" });
		}

		await user.save();

		responseReturn(res, 200, {
			settings: user.settings,
			message: "Impostazioni aggiornate",
		});
	} catch (error) {
		responseReturn(res, 500, { error: "Errore interno del server" });
	}
};
