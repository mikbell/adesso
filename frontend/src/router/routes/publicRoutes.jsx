import { lazy } from "react";

const Home = lazy(() => import("../../views/pages/Home"))
const Login = lazy(() => import("../../views/auth/Login"))
const Register = lazy(() => import("../../views/auth/Register"))
const Unauthorized = lazy(() => import("../../views/pages/Unauthorized"))

const publicRoutes = [
	{
		path: "/",
		element: <Home />,
	},

	{
		path: "/login",
		element: <Login />,
	},

	{
		path: "/register",
		element: <Register />,
	},

	{
		path: "/unauthorized",
		element: <Unauthorized />,
	}
];

export default publicRoutes;
