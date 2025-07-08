import { MdDashboard, MdOutlineShoppingCart, MdOutlineCategory, MdSupervisedUserCircle, MdPayment, MdDiscount } from "react-icons/md";
import { FaUserXmark, FaCodePullRequest, FaPlus } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";

// Definiamo tutti i possibili link di navigazione con le loro regole di accesso.
const allNavLinks = [
	// --- Link Amministratore ---
	{ id: 1, title: "Dashboard", icon: <MdDashboard />, role: "admin", path: "/admin/dashboard" },
	{ id: 2, title: "Ordini", icon: <MdOutlineShoppingCart />, role: "admin", path: "/admin/dashboard/orders" },
	{ id: 3, title: "Categorie", icon: <MdOutlineCategory />, role: "admin", path: "/admin/dashboard/categories" },
	{ id: 4, title: "Venditori", icon: <MdSupervisedUserCircle />, role: "admin", path: "/admin/dashboard/sellers" },
	{ id: 5, title: "Richieste Pagamenti", icon: <MdPayment />, role: "admin", path: "/admin/dashboard/payment-requests" },
	{ id: 6, title: "Venditori Inattivi", icon: <FaUserXmark />, role: "admin", path: "/admin/dashboard/deactive-sellers" },
	{ id: 7, title: "Richieste Venditori", icon: <FaCodePullRequest />, role: "admin", path: "/admin/dashboard/seller-requests" },
	{ id: 8, title: "Chat", icon: <IoIosChatbubbles />, role: "admin", path: "/admin/dashboard/seller-chat" },

	// --- Link Venditore ---
	{ id: 9, title: "Dashboard", icon: <MdDashboard />, role: "seller", status: 'active', path: "/seller/dashboard" },
	{ id: 10, title: "Aggiungi Prodotto", icon: <FaPlus />, role: "seller", status: 'active', path: "/seller/dashboard/add-product" },
	{ id: 11, title: "Prodotti", icon: <AiFillProduct />, role: "seller", status: 'active', path: "/seller/dashboard/products" },
	{ id: 12, title: "Prodotti Scontati", icon: <MdDiscount />, role: "seller", status: 'active', path: "/seller/dashboard/discounted-products" },
	{ id: 13, title: "Ordini", icon: <MdOutlineShoppingCart />, role: "seller", visibility: ['active', 'deactive'], path: "/seller/dashboard/orders" },
	{ id: 14, title: "Pagamenti", icon: <MdPayment />, role: "seller", status: 'active', path: "/seller/dashboard/payments" },
	{ id: 15, title: "Chat con Clienti", icon: <IoIosChatbubbles />, role: "seller", status: 'active', path: "/seller/dashboard/customer-chat" },
	{ id: 16, title: "Chat con Supporto", icon: <IoIosChatbubbles />, role: "seller", visibility: ['active', 'deactive', 'pending'], path: "/seller/dashboard/support-chat" },
];

/**
 * @description Filtra i link di navigazione in base al ruolo e allo stato dell'utente.
 * @param {string} role - Il ruolo dell'utente (es. 'admin', 'seller').
 * @param {string} status - Lo stato dell'utente (es. 'active', 'pending').
 * @returns {Array} Un array di oggetti link validi per l'utente.
 */
export const getNavs = (role, status) => {
	const finalNavs = [];
	for (let i = 0; i < allNavLinks.length; i++) {
		const nav = allNavLinks[i];

		// 1. Il ruolo deve corrispondere
		if (nav.role === role) {
			// 2. Se è richiesto uno stato specifico, deve corrispondere
			if (nav.status && nav.status === status) {
				finalNavs.push(nav);
			}
			// 3. Se è definita una lista di visibilità, lo stato dell'utente deve essere incluso
			else if (nav.visibility && nav.visibility.includes(status)) {
				finalNavs.push(nav);
			}
			// 4. Se non ci sono requisiti di stato o visibilità, il link è valido (solo per il ruolo)
			else if (!nav.status && !nav.visibility) {
				finalNavs.push(nav);
			}
		}
	}
	return finalNavs;
};
