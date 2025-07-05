const dummySellers = [
	{
		id: "S001",
		name: "Tech Innovations",
		email: "tech@example.com",
		phone: "333-1234567",
		address: "Via Roma 1", // Indirizzo civico
		division: "Lombardia", // Es. Regione
		district: "Milano", // Es. Provincia/Città
		state: "Italia", // Es. Stato
		joinDate: "2023-01-15",
		productsCount: 150,
		ordersProcessed: 500,
		totalRevenue: "€150.000",
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=50",
		role: "venditore",
	},
	{
		id: "S002",
		name: "Fashion Hub",
		email: "fashion@example.com",
		phone: "345-9876543",
		address: "Corso Italia 10",
		division: "Lazio",
		district: "Roma",
		state: "Italia",
		joinDate: "2022-03-20",
		productsCount: 230,
		ordersProcessed: 700,
		totalRevenue: "€200.000",
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=51",
		role: "venditore",
	},
	{
		id: "S003",
		name: "Book Nook",
		email: "books@example.com",
		phone: "321-1122334",
		address: "Piazza Duomo 5",
		division: "Toscana",
		district: "Firenze",
		state: "Italia",
		joinDate: "2024-02-10",
		productsCount: 90,
		ordersProcessed: 120,
		totalRevenue: "€30.000",
		status: "Inattivo",
		paymentStatus: "In attesa",
		image: "https://i.pravatar.cc/300?img=52",
		role: "venditore",
	},
	{
		id: "S004",
		name: "Home Essentials",
		email: "home@example.com",
		phone: "388-7766554",
		address: "Via Dante 8",
		division: "Piemonte",
		district: "Torino",
		state: "Italia",
		joinDate: "2023-05-01",
		productsCount: 180,
		ordersProcessed: 400,
		totalRevenue: "€120.000",
		status: "Attivo",
		paymentStatus: "Rifiutato",
		image: "https://i.pravatar.cc/300?img=53",
		role: "venditore",
	},
	{
		id: "S005",
		name: "Garden Goods",
		email: "garden@example.com",
		phone: "366-5544332",
		address: "Via Verdi 22",
		division: "Emilia-Romagna",
		district: "Bologna",
		state: "Italia",
		joinDate: "2024-04-01",
		productsCount: 75,
		ordersProcessed: 80,
		totalRevenue: "€22.000",
		status: "In attesa",
		paymentStatus: "In attesa",
		image: "https://i.pravatar.cc/300?img=54",
		role: "venditore",
	},
	{
		id: "S006",
		name: "Sport Gear",
		email: "sport@example.com",
		address: "Via dello Sport 5",
		division: "Veneto",
		district: "Verona",
		state: "Italia",
		productsCount: 110,
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=55",
		role: "venditore",
	},
	{
		id: "S007",
		name: "Beauty Zone",
		email: "beauty@example.com",
		address: "Corso Francia 1",
		division: "Lazio",
		district: "Roma",
		state: "Italia",
		productsCount: 95,
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=56",
		role: "venditore",
	},
	{
		id: "S008",
		name: "Game World",
		email: "games@example.com",
		address: "Via dei Giardini 12",
		division: "Puglia",
		district: "Bari",
		state: "Italia",
		productsCount: 140,
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=57",
		role: "venditore",
	},
	{
		id: "S009",
		name: "Auto Parts Pro",
		email: "auto@example.com",
		address: "Viale Industria 7",
		division: "Campania",
		district: "Napoli",
		state: "Italia",
		productsCount: 60,
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=58",
		role: "venditore",
	},
	{
		id: "S010",
		name: "DIY Supplies",
		email: "diy@example.com",
		address: "Piazza del Popolo 3",
		division: "Sicilia",
		district: "Palermo",
		state: "Italia",
		productsCount: 80,
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=59",
		role: "venditore",
	},
	{
		id: "S011",
		name: "Software Solutions",
		email: "software@example.com",
		address: "Via della Scienza 10",
		division: "Lombardia",
		district: "Milano",
		state: "Italia",
		productsCount: 45,
		status: "Attivo",
		paymentStatus: "Confermato",
		image: "https://i.pravatar.cc/300?img=60",
		role: "venditore",
	},
	{
		id: "S012",
		name: "Music Mania",
		email: "music@example.com",
		address: "Via dei Suoni 2",
		division: "Campania",
		district: "Napoli",
		state: "Italia",
		productsCount: 30,
		status: "Inattivo",
		paymentStatus: "In attesa",
		image: "https://i.pravatar.cc/300?img=61",
		role: "venditore",
	},
];

/**
 * Recupera tutti i venditori.
 * @returns {Promise<Array>} Un array di oggetti venditore.
 */
export const fetchAllSellers = async () => {
	// Simula una chiamata API con un ritardo
	return dummySellers;
};

/**
 * Recupera i dettagli di un singolo venditore tramite ID.
 * @param {string} sellerId L'ID del venditore da cercare.
 * @returns {Promise<Object|null>} L'oggetto venditore o null se non trovato.
 */
export const fetchSellerDetails = async (sellerId) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const seller = dummySellers.find((s) => s.id === sellerId);
			resolve(seller);
		}, 300); // Ritardo di 300ms
	});
};

/**
 * Funzione utility per le classi di stato.
 * Puoi anche mantenerla direttamente nel componente se la ritieni specifica per la UI di quel componente.
 * Tuttavia, centralizzarla qui la rende riutilizzabile.
 * @param {string} statusString Lo stato del venditore (es. 'Attivo', 'Inattivo').
 * @returns {string} Le classi Tailwind CSS per lo stato.
 */
export const getStatusClasses = (statusString) => {
	switch (statusString) {
		case "Attivo":
			return "bg-green-100 text-green-800";
		case "Inattivo":
			return "bg-red-100 text-red-800";
		case "In attesa":
			return "bg-yellow-100 text-yellow-800";
		case "Rifiutato":
			return "bg-gray-100 text-gray-800";
		case "Confermato":
			return "bg-blue-100 text-blue-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

// Potresti aggiungere altre funzioni qui, come:
// export const addSeller = async (newSeller) => { ... };
// export const updateSeller = async (sellerId, updatedData) => { ... };
// export const deleteSeller = async (sellerId) => { ... };
