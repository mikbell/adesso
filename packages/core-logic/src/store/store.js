// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";

// 1. Import all of your reducers
import authReducer from "./reducers/authSlice";
import categoryReducer from "./reducers/categorySlice";
import productReducer from "./reducers/productSlice";
import userReducer from "./reducers/userSlice";
import paymentReducer from "./reducers/paymentSlice";
import chatReducer from "./reducers/chatSlice";
import orderReducer from "./reducers/orderSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		category: categoryReducer,
		product: productReducer,
		user: userReducer,
		payment: paymentReducer,
		order: orderReducer,
		chat: chatReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	devTools: process.env.NODE_ENV !== "production",
});

export default store;
