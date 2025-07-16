// src/data/paymentsData.js
export const paymentsData = Array.from({ length: 40 }, (_, i) => {
	const statuses = ["Completato", "In sospeso", "Fallito", "Rimborsato"];
	const methods = ["visa", "paypal", "mastercard", "bonifico"];
	const names = [
		"Mario Rossi",
		"Luigi Bianchi",
		"Anna Verdi",
		"Chiara Neri",
		"Paolo Gialli",
	];

	return {
		transactionId: `txn_${Math.random()
			.toString(36)
			.substr(2, 10)
			.toUpperCase()}`,
		orderId: `#ORD-${1001 + i}`,
		date: new Date(Date.now() - i * 18 * 60 * 60 * 1000).toISOString(),
		customerName: names[i % names.length],
		amount: (Math.random() * (500 - 20) + 20).toFixed(2),
		method: methods[i % methods.length],
		status: statuses[i % statuses.length],
	};
});
