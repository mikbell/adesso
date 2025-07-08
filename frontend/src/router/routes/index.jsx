import { privateRoutes } from "./privateRoutes";
import MainLayout from "../../layout/MainLayout";
import ProtectedRoutes from "./protectedRoutes";

export const getRoutes = () => {

	privateRoutes.map((route) => {
		route.element = <ProtectedRoutes route={route}>{route.element}</ProtectedRoutes>
	});

	return {
		path: "/",
		element: <MainLayout />,
		children: privateRoutes,
	};
};
