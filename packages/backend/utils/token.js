import jwt from "jsonwebtoken";

/**
 * @description Crea un token JWT firmato.
 * @param {object} payload - I dati da includere nel token (es. id, role).
 * @returns {string} Il token JWT firmato.
 */
export const createToken = (payload) => {
	// Firma il token con la chiave segreta e imposta una scadenza.
	// È FONDAMENTALE che 'process.env.JWT_SECRET' sia la stessa chiave usata nel middleware.
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "7d", // Esempio: il token scadrà tra 7 giorni
	});
	return token;
};
