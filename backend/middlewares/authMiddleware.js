import jwt from "jsonwebtoken";

// Helper function to verify JWT and attach user to request
const verifyToken = (req, res, next, requiredRole = null) => {
	const { token } = req.cookies;

	if (!token) {
		return res
			.status(401)
			.json({ message: "Non autorizzato: Token mancante." });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			// Differentiate between generic unauthorized and invalid token
			return res
				.status(401)
				.json({ message: "Non autorizzato: Token non valido o scaduto." });
		}

		// If a specific role is required, check it
		if (requiredRole && decoded.role !== requiredRole) {
			return res
				.status(403)
				.json({ message: "Non autorizzato: Ruolo insufficiente." }); // 403 Forbidden for insufficient role
		}

		req.user = decoded; // Attach the decoded payload to the request
		next(); // Proceed to the next middleware or route handler
	});
};

/**
 * Middleware to authenticate any logged-in user.
 * Attaches decoded user information to req.user.
 */
export const authMiddleware = (req, res, next) => {
	verifyToken(req, res, next);
};

/**
 * Middleware to authenticate an administrator.
 * Attaches decoded admin information to req.user.
 */
export const adminMiddleware = (req, res, next) => {
	verifyToken(req, res, next, "admin");
};

/**
 * Middleware to authenticate a regular user.
 * Attaches decoded user information to req.user.
 */
export const userMiddleware = (req, res, next) => {
	verifyToken(req, res, next, "user");
};
