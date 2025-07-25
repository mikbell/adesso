import { lazy } from "react";

// Import dei componenti...
const SellerDashboard = lazy(() => import("../../views/seller/SellerDashboard"));
const AddProduct = lazy(() => import("../../views/seller/AddProduct"));
const Products = lazy(() => import("../../views/seller/Products"));
const Orders = lazy(() => import("../../views/seller/Orders"));
const Payments = lazy(() => import("../../views/seller/Payments"));
const CustomerChat = lazy(() => import("../../views/seller/CustomerChat"));
const SupportChat = lazy(() => import("../../views/seller/SupportChat"));
const Profile = lazy(() => import("../../views/seller/Profile"));
const Settings = lazy(() => import("../../views/seller/Settings"));
const EditProfile = lazy(() => import("../../views/seller/EditProfile"));
const ViewProduct = lazy(() => import("../../views/seller/ViewProduct"));
const EditProduct = lazy(() => import("../../views/seller/EditProduct"));
const Pending = lazy(() => import("../../views/seller/Pending"));
const Deactive = lazy(() => import("../../views/seller/Deactive"));

const SellerRoutes = [
    // --- Pagine di Stato ---
    // Queste pagine ora specificano esattamente quale stato può visualizzarle.
    {
        path: "/seller/account-pending",
        element: <Pending />,
        role: 'seller',
        statuses: ['pending'] // Solo gli utenti con stato 'pending' possono vedere questa pagina.
    },
    {
        path: "/seller/account-deactive",
        element: <Deactive />,
        role: 'seller',
        statuses: ['deactive'] // Solo gli utenti con stato 'deactive' possono vedere questa pagina.
    },

    // --- Rotte della Dashboard (per utenti attivi) ---
    {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
        role: 'seller',
        statuses: ['active']
    },
    {
        path: "/seller/dashboard/add-product",
        element: <AddProduct />,
        role: 'seller',
        statuses: ['active']
    },
    {
        path: "/seller/dashboard/products/:productId/edit",
        element: <EditProduct />,
        role: 'seller',
        statuses: ['active']
    },
    {
        path: "/seller/dashboard/products",
        element: <Products />,
        role: 'seller',
        statuses: ['active']
    },
    {
        path: "/seller/dashboard/payments",
        element: <Payments />,
        role: 'seller',
        statuses: ['active']
    },
    {
        path: "/seller/dashboard/customer-chat",
        element: <CustomerChat />,
        role: 'seller',
        statuses: ['active']
    },
    {
        path: "/seller/dashboard/profile",
        element: <Profile />,
        role: 'seller',
        statuses: ['active']
    },

    // --- Rotte con Visibilità Multipla ---
    {
        path: "/seller/dashboard/products/:productId/view",
        element: <ViewProduct />,
        role: 'seller',
        statuses: ['active', 'deactive']
    },
    {
        path: "/seller/dashboard/orders",
        element: <Orders />,
        role: 'seller',
        statuses: ['active', 'deactive']
    },
    {
        path: "/seller/dashboard/support-chat",
        element: <SupportChat />,
        role: 'seller',
        statuses: ['active', 'deactive', 'pending']
    },
    {
        path: "/seller/dashboard/profile/edit",
        element: <EditProfile />,
        role: 'seller',
        statuses: ['active', 'deactive', 'pending']
    },
    {
        path: "/seller/dashboard/settings",
        element: <Settings />,
        role: 'seller',
        statuses: ['active', 'deactive', 'pending']
    },
];

export default SellerRoutes;
