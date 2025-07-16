// src/data/discountedProductsData.js
export const discountedProductsData = Array.from({ length: 12 }, (_, i) => {
	const categories = ["Elettronica", "Casa", "Abbigliamento", "Sport"];
	const originalPrice = parseFloat(
		(Math.random() * (300 - 50) + 50).toFixed(2)
	);
	const discountPercentage = Math.floor(Math.random() * (50 - 10) + 10);
	const discountPrice = parseFloat(
		(originalPrice * (1 - discountPercentage / 100)).toFixed(2)
	);

	return {
		id: `d_prod_${2001 + i}`,
		name: `Prodotto in Saldo ${i + 1}`,
		image: `https://picsum.photos/seed/${2001 + i}/400/400`,
		category: categories[i % categories.length],
		rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
		originalPrice,
		discountPrice,
		discountPercentage,
	};
});
