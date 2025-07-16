// src/utils/statusUtils.js

/**
 * Restituisce le classi Tailwind CSS appropriate in base a uno stato.
 * Questa funzione centralizzata permette di avere stili coerenti in tutta l'app.
 * @param {string} status - Lo stato da valutare (es. 'active', 'pending', 'deactive').
 * @returns {string} Una stringa di classi Tailwind.
 */
export const getStatusClasses = (status) => {
	switch (status?.toLowerCase()) {
		case "active":
		case "paid":
		case "delivered":
			return "bg-green-100 text-green-800";
		case "pending":
		case "processing":
			return "bg-yellow-100 text-yellow-800";
		case "deactive":
		case "cancelled":
		case "inactive":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};
