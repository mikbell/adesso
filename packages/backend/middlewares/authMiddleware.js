import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
	// -> Legge il token dai cookie della richiesta invece che dagli header
	const token = req.cookies.authToken;

	if (!token) {
		return res
			.status(401)
			.json({ error: "Autenticazione fallita: Token non fornito." });
	}

	try {
		// -> Verifica il token usando la STESSA chiave segreta del controller
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// -> Allega l'ID e il ruolo dell'utente alla richiesta per le funzioni successive
		req.id = decoded.id;
		req.role = decoded.role;

		next(); // -> Passa al controller successivo
	} catch (error) {
		// Se la verifica fallisce (es. token scaduto o manomesso)
		return res
			.status(401)
			.json({ error: "Autenticazione fallita: Token non valido o scaduto." });
	}
};

export default authMiddleware;
