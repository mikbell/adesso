import jwt from "jsonwebtoken";

/**
 * @description Middleware per verificare un token JWT inviato nell'header Authorization.
 * @param {object} req - Oggetto della richiesta Express.
 * @param {object} res - Oggetto della risposta Express.
 * @param {function} next - Funzione per passare al prossimo middleware.
 */
const authMiddleware = async (req, res, next) => {
	// 1. Recupera l'header 'Authorization' dalla richiesta.
	const authHeader = req.headers.authorization;

	// 2. Controlla se l'header esiste e se inizia con "Bearer ".
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			error:
				"Autenticazione fallita: Token non fornito o in formato non valido.",
		});
	}

	try {
		// 3. Estrae il token rimuovendo il prefisso "Bearer ".
		const token = authHeader.split(" ")[1];

		// 4. Verifica il token usando la chiave segreta.
		//    Assicurati che 'process.env.JWT_SECRET' corrisponda alla chiave usata per creare il token.
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		// 5. Se il token è valido, allega le informazioni decodificate (id, role)
		//    all'oggetto della richiesta (req) per renderle disponibili nelle rotte successive.
		req.id = decodedToken.id;
		req.role = decodedToken.role;

		// 6. Passa il controllo al gestore della rotta successivo.
		next();
	} catch (error) {
		// Se jwt.verify fallisce (token non valido, scaduto, etc.), invia un errore 401.
		return res
			.status(401)
			.json({ error: "Autenticazione fallita: Token non valido o scaduto." });
	}
};

export default authMiddleware;
