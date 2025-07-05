import { MdDashboard, MdOutlineShoppingCart, MdOutlineCategory, MdSupervisedUserCircle, MdPayment, MdDiscount } from "react-icons/md";
import { FaUserXmark, FaCodePullRequest } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";

export const allNav = [
	{
		id: 1,
		title: "Dashboard",
		icon: <MdDashboard />,
		role: "admin",
		path: "/admin/dashboard",
	},

	{
		id: 2,
		title: "Ordini",
		icon: <MdOutlineShoppingCart />,
		role: "admin",
		path: "/admin/dashboard/orders",
	},

	{
		id: 3,
		title: "Categorie",
		icon: <MdOutlineCategory />,
		role: "admin",
		path: "/admin/dashboard/categories",
	},
	{
		id: 4,
		title: "Venditori",
		icon: <MdSupervisedUserCircle />,
		role: "admin",
		path: "/admin/dashboard/sellers",
	},
	{
		id: 5,
		title: "Richieste Pagamenti",
		icon: <MdPayment />,
		role: "admin",
		path: "/admin/dashboard/payment-requests",
	},
	{
		id: 6,
		title: "Venditori Inattivi",
		icon: <FaUserXmark />,
		role: "admin",
		path: "/admin/dashboard/deactive-sellers",
	},

	{
		id: 7,
		title: "Richieste Venditori",
		icon: <FaCodePullRequest />,
		role: "admin",
		path: "/admin/dashboard/seller-requests",
	},

	{
		id: 8,
		title: "Chat",
		icon: <IoIosChatbubbles />,
		role: "admin",
		path: "/admin/dashboard/seller-chat",
	},

	{
		id: 9,
		title: "Dashboard",
		icon: <MdDashboard />,
		role: "seller",
		path: "/seller/dashboard",
	},

	{
		id: 10,
		title: "Aggiungi Prodotto",
		icon: <FaPlus />,
		role: "seller",
		path: "/seller/dashboard/add-product",
	},

	{
		id: 11,
		title: "Prodotti",
		icon: <AiFillProduct />,
		role: "seller",
		path: "/seller/dashboard/products",
	},
	{
		id: 12,
		title: "Prodotti Scontati",
		icon: <MdDiscount />,
		role: "seller",
		path: "/seller/dashboard/discounted-products",
	},
	{
		id: 13,
		title: "Ordini",
		icon: <MdOutlineShoppingCart />,
		role: "seller",
		path: "/seller/dashboard/orders",
	},

	{
		id: 14,
		title: "Pagamenti",
		icon: <MdPayment />,
		role: "seller",
		path: "/seller/dashboard/payments",
	},

	{
		id: 15,
		title: "Chat con Clienti",
		icon: <IoIosChatbubbles />,
		role: "seller",
		path: "/seller/dashboard/customer-chat",
	},

	{
		id: 16,
		title: "Chat con Supporto",
		icon: <IoIosChatbubbles />,
		role: "seller",
		path: "/seller/dashboard/support-chat",
	},

];
