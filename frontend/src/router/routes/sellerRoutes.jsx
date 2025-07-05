import { lazy } from "react";

const Home = lazy(() => import("../../views/pages/Home"))
const SellerDashboard = lazy(() => import("../../views/seller/SellerDashboard"))
const AddProduct = lazy(() => import("../../views/seller/AddProduct"))
const Products = lazy(() => import("../../views/seller/Products"))
const DiscountedProducts = lazy(() => import("../../views/seller/DiscountedProducts"))
const Orders = lazy(() => import("../../views/seller/Orders"))
const Payments = lazy(() => import("../../views/seller/Payments"))
const CustomerChat = lazy(() => import("../../views/seller/CustomerChat"))
const SupportChat = lazy(() => import("../../views/seller/SupportChat"))

export const sellerRoutes = [
    {
        path: "/",
        element: <Home />,
        ability: ['admin', 'seller']
    },
    {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/add-product",
        element: <AddProduct />,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/products",
        element: <Products />,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/discounted-products",
        element: <DiscountedProducts />,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/orders",
        element: <Orders />,
        role: 'seller',
        ability: ['active', 'deactive']
    },
    {
        path: "/seller/dashboard/payments",
        element: <Payments />,
        role: 'seller',
        status: 'active'
    },
    {
        path: "/seller/dashboard/customer-chat",
        element: <CustomerChat />,
        ability: ['seller']
    },
    {
        path: "/seller/dashboard/support-chat",
        element: <SupportChat />,
        ability: ['seller']
    },
];