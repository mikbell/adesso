// src/data/productsData.js

export const productsData = Array.from({ length: 25 }, (_, i) => {
	const categories = ["Elettronica", "Abbigliamento", "Casa", "Libri"];
	const statuses = ["Pubblicato", "Bozza", "Archiviato"];
	const category = categories[i % categories.length];

	return {
		id: `prod_${1001 + i}`,
		name: `Prodotto Esempio ${i + 1}`,
		image: `https://picsum.photos/seed/${1001 + i}/64/64`,
		sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
		category,
		price: (Math.random() * (1000 - 10) + 10).toFixed(2),
		stock: Math.floor(Math.random() * 200),
		status: statuses[i % statuses.length],
	};
});

// ... (l'array 'productsData' esistente rimane qui)

// Nuova funzione per recuperare un prodotto con dettagli aggiuntivi
export const fetchProductById = (productId) => {
	return new Promise((resolve, reject) => {
		const product = productsData.find((p) => p.id === productId);

		if (!product) {
			return reject(new Error("Product not found"));
		}

		// Simula dati aggiuntivi che un'API potrebbe fornire
		const detailedProduct = {
			...product,
			images: [
				product.image, // Immagine principale
				`https://picsum.photos/seed/${product.id}_2/400/400`,
				`https://picsum.photos/seed/${product.id}_3/400/400`,
				`https://picsum.photos/seed/${product.id}_4/400/400`,
			],
			fullDescription: `Questa è una descrizione completa e dettagliata per ${product.name}. Parla delle sue caratteristiche uniche, dei materiali di alta qualità e dei benefici per il cliente. Un testo più lungo per riempire lo spazio.`,
			activity: [
				{ id: 1, type: "create", user: "Maria Rossi", date: "2024-05-10" },
				{
					id: 2,
					type: "update",
					user: "Maria Rossi",
					date: "2024-06-15",
					details: "Prezzo modificato da €89.99 a €99.99",
				},
				{
					id: 3,
					type: "stock",
					user: "Sistema",
					date: "2024-07-01",
					details: "Aggiunte 50 unità allo stock",
				},
			],
		};

		setTimeout(() => resolve(detailedProduct), 300);
	});
};
