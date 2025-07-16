// src/data/ordersData.js
export const ordersData = Array.from({ length: 30 }, (_, i) => {
	const statuses = ["Consegnato", "In transito", "In attesa", "Annullato"];
	const names = [
		"Mario Rossi",
		"Luigi Bianchi",
		"Anna Verdi",
		"Chiara Neri",
		"Paolo Gialli",
	];

	return {
		id: `#ORD-${1001 + i}`,
		customerName: names[i % names.length],
		customerEmail: `${names[i % names.length]
			.toLowerCase()
			.replace(" ", ".")}@example.com`,
		date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		total: (Math.random() * (500 - 20) + 20).toFixed(2),
		status: statuses[i % statuses.length],
		itemCount: Math.floor(Math.random() * 5) + 1,
	};
});

export const fetchDetailedOrderById = (orderId) => {
	return new Promise((resolve, reject) => {
		// Cerca l'ordine base nell'array principale
		const baseOrder = ordersData.find((o) => o.id === `#ORD-${orderId}`);

		if (!baseOrder) {
			return reject(new Error("Order not found"));
		}

		// Simula dati aggiuntivi che un'API restituirebbe
		const detailedData = {
			...baseOrder,
			shippingAddress: "Via Roma, 1\n00184 Roma, RM\nItalia",
			payment: {
				method: baseOrder.method,
				transactionId: `txn_${Math.random()
					.toString(36)
					.substr(2, 10)
					.toUpperCase()}`,
			},
			products: [
				{
					id: "p1",
					name: "Smartphone Pro X",
					image: "https://picsum.photos/seed/101/64/64",
					quantity: 1,
					price: (baseOrder.total * 0.8).toFixed(2),
				},
				{
					id: "p2",
					name: "Caricatore Rapido",
					image: "https://picsum.photos/seed/102/64/64",
					quantity: 1,
					price: (baseOrder.total * 0.2).toFixed(2),
				},
			],
			history: [
				{
					status: "Consegnato",
					date: baseOrder.date,
					comment: "Pacco consegnato al cliente.",
				},
				{
					status: "In transito",
					date: new Date(
						new Date(baseOrder.date).getTime() - 1 * 24 * 60 * 60 * 1000
					)
						.toISOString()
						.split("T")[0],
					comment: "Spedizione partita dal magazzino.",
				},
				{
					status: "Pagato",
					date: new Date(
						new Date(baseOrder.date).getTime() - 2 * 24 * 60 * 60 * 1000
					)
						.toISOString()
						.split("T")[0],
					comment: "Pagamento confermato.",
				},
			].filter((h) => new Date(h.date) <= new Date(baseOrder.date)), // Mostra solo la cronologia pertinente
		};

		setTimeout(() => resolve(detailedData), 300); // Simula ritardo di rete
	});
};
