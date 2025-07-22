import { configureStore } from "@reduxjs/toolkit";

// -> Importa i reducer dalla libreria di logica condivisa
import {
	authReducer,
	userReducer,
	productReducer,
	categoryReducer,
	paymentReducer,
	orderReducer,
	chatReducer,
	dashboardReducer,
	reviewReducer,
} from "@adesso/core-logic";

const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		product: productReducer,
		category: categoryReducer,
		payment: paymentReducer,
		order: orderReducer,
		chat: chatReducer,
		dashboard: dashboardReducer,
		review: reviewReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	devTools: window.location.hostname !== "production",
});

export default store;
