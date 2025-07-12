import { MdDashboard, MdOutlineShoppingCart, MdOutlineCategory, MdSupervisedUserCircle, MdPayment } from "react-icons/md";
import { FaUserCheck, FaUserClock, FaUserXmark } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";


// Definiamo tutti i possibili link di navigazione con una struttura dati coerente.
const allNavLinks = [
	// --- Link Amministratore ---
	{ id: 1, title: "Dashboard", icon: <MdDashboard />, role: "admin", path: "/admin/dashboard" },
	{ id: 2, title: "Ordini", icon: <MdOutlineShoppingCart />, role: "admin", path: "/admin/dashboard/orders" },
	{ id: 3, title: "Categorie", icon: <MdOutlineCategory />, role: "admin", path: "/admin/dashboard/categories" },
	{ id: 4, title: "Venditori", icon: <MdSupervisedUserCircle />, role: "admin", path: "/admin/dashboard/sellers/all" }, // -> Path aggiornato
	{ id: 5, title: "Richieste Pagamenti", icon: <MdPayment />, role: "admin", path: "/admin/dashboard/payment-requests" },
	{ id: 6, title: "Chat", icon: <IoIosChatbubbles />, role: "admin", path: "/admin/dashboard/chat" },

	// --- Link Venditore ---
	// Usiamo sempre la proprietà 'statuses' (un array) per la visibilità basata sullo stato.
	{ id: 7, title: "Dashboard", icon: <MdDashboard />, role: "seller", path: "/seller/dashboard", statuses: ['active', 'deactive'] },
	{ id: 8, title: "Aggiungi Prodotto", icon: <FaPlus />, role: "seller", path: "/seller/dashboard/add-product", statuses: ['active'] },
	{ id: 9, title: "Prodotti", icon: <AiFillProduct />, role: "seller", path: "/seller/dashboard/products", statuses: ['active'] },
	{ id: 10, title: "Ordini", icon: <MdOutlineShoppingCart />, role: "seller", path: "/seller/dashboard/orders", statuses: ['active', 'deactive'] },
	{ id: 11, title: "Pagamenti", icon: <MdPayment />, role: "seller", path: "/seller/dashboard/payments", statuses: ['active'] },
	{ id: 12, title: "Chat con Clienti", icon: <IoIosChatbubbles />, role: "seller", path: "/seller/dashboard/customer-chat", statuses: ['active'] },
	{ id: 13, title: "Supporto", icon: <IoIosChatbubbles />, role: "seller", path: "/seller/dashboard/support-chat", statuses: ['active', 'deactive', 'pending'] },
];

/**
 * @description Filtra i link di navigazione in base al ruolo e allo stato dell'utente.
 * @param {string} role - Il ruolo dell'utente (es. 'admin', 'seller').
 * @param {string} status - Lo stato dell'utente (es. 'active', 'pending').
 * @returns {Array} Un array di oggetti link validi per l'utente.
 */
export const getNavs = (role, status) => {
	// Usiamo il metodo .filter() per un codice più pulito e dichiarativo.
	const filteredNavs = allNavLinks.filter(nav => {
		// Il ruolo deve sempre corrispondere.
		const roleMatch = nav.role === role;

		// Se la rotta ha dei requisiti di stato, controlla se lo stato dell'utente è incluso.
		// Se non ha requisiti di stato, è visibile a tutti quelli con il ruolo corretto.
		const statusMatch = !nav.statuses || nav.statuses.includes(status);

		return roleMatch && statusMatch;
	});
	return filteredNavs;
};