import { lazy } from "react";

const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"))
const Orders = lazy(() => import("../../views/admin/Orders"))
const Categories = lazy(() => import("../../views/admin/Categories"))
const Sellers = lazy(() => import("../../views/admin/Sellers"))
const SellerDetails = lazy(() => import("../../views/admin/SellerDetails"))
const PaymentRequests = lazy(() => import("../../views/admin/PaymentRequests"))
const DeactiveSellers = lazy(() => import("../../views/admin/DeactiveSellers"))
const SellerRequests = lazy(() => import("../../views/admin/SellerRequests"))
const SellerChat = lazy(() => import("../../views/admin/SellerChat"))
const OrderDetails = lazy(() => import("../../views/admin/OrderDetails"))

export const adminRoutes = [
    {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/orders",
        element: <Orders />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/categories",
        element: <Categories />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/sellers",
        element: <Sellers />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/sellers/:sellerId/view",
        element: <SellerDetails />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/payment-requests",
        element: <PaymentRequests />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/Deactive-sellers",
        element: <DeactiveSellers />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/seller-requests",
        element: <SellerRequests />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/seller-chat",
        element: <SellerChat />,
        role: "admin"
    },
    {
        path: "/admin/dashboard/orders/:orderId",
        element: <OrderDetails />,
        role: "admin"
    },
];