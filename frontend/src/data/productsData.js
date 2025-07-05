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
