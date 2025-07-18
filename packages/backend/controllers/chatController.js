import User from "../models/userModel.js";
import ChatMessage from "../models/chatMessageModel.js";
import { responseReturn } from "../utils/response.js";

// Ottiene tutti i venditori per la chat dell'admin
export const getSellersForChat = async (req, res) => {
	try {
		const sellers = await User.find({ role: "seller" }).select(
			"name email avatarUrl"
		);
		responseReturn(res, 200, { sellers });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero dei venditori" });
	}
};

// Ottiene i messaggi tra l'admin e un venditore specifico
export const getMessages = async (req, res) => {
	const adminId = req.id; // L'ID dell'admin loggato
	const { sellerId } = req.params;
	try {
		const messages = await ChatMessage.find({
			$or: [
				{ senderId: adminId, receiverId: sellerId },
				{ senderId: sellerId, receiverId: adminId },
			],
		}).sort({ createdAt: 1 }); // Ordina dal più vecchio al più recente
		responseReturn(res, 200, { messages });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero dei messaggi" });
	}
};

// L'admin invia un messaggio a un venditore
export const sendMessage = async (req, res) => {
	const adminId = req.id;
	const { sellerId, message } = req.body;
	try {
		const newMessage = await ChatMessage.create({
			senderId: adminId,
			receiverId: sellerId,
			message,
		});
		responseReturn(res, 201, { message: newMessage });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nell'invio del messaggio" });
	}
};

// In controllers/chatController.js

// Ottiene i clienti che hanno chattato con il venditore loggato
export const getCustomersForSeller = async (req, res) => {
	const sellerId = req.id; // ID del venditore loggato
	try {
		// Trova tutti gli ID unici dei clienti che hanno inviato un messaggio al venditore
		const customerIds = await ChatMessage.distinct("senderId", {
			receiverId: sellerId,
		});
		// Recupera i dati di quegli utenti
		const customers = await User.find({ _id: { $in: customerIds } }).select(
			"name email avatarUrl"
		);
		responseReturn(res, 200, { customers });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nel recupero dei clienti" });
	}
};

// Il venditore invia un messaggio a un cliente
export const sellerSendMessage = async (req, res) => {
	const sellerId = req.id;
	const { customerId, message } = req.body;
	try {
		const newMessage = await ChatMessage.create({
			senderId: sellerId,
			receiverId: customerId,
			message,
		});
		responseReturn(res, 201, { message: newMessage });
	} catch (error) {
		responseReturn(res, 500, { error: "Errore nell'invio del messaggio" });
	}
};

// Il recupero dei messaggi (getMessages) è lo stesso, possiamo riutilizzarlo.
