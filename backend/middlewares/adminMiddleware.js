const adminMiddleware = async (req, res, next) => {
	// req.role è impostato dal precedente authMiddleware
	if (req.role === "admin") {
		next();
	} else {
		res
			.status(403)
			.json({ error: "Accesso negato: richiesta non autorizzata." });
	}
};
export default adminMiddleware;
