// src/store/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit"; // Importa combineReducers
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// 1. Import all of your reducers
import authReducer from "./reducers/authSlice";
import categoryReducer from "./reducers/categorySlice";
import productReducer from "./reducers/productSlice";
import userReducer from "./reducers/userSlice";
import paymentReducer from "./reducers/paymentSlice";
import chatReducer from "./reducers/chatSlice";
import orderReducer from "./reducers/orderSlice";
import dashboardReducer from "./reducers/dashboardSlice";
import reviewReducer from "./reducers/reviewSlice";
import cartReducer from "./reducers/cartSlice";

// 2. Definisci la configurazione per redux-persist
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["category", "auth", "user"],
};

// 3. Combina tutti i tuoi slice in una singola funzione reducer
const rootReducer = combineReducers({
	auth: authReducer,
	category: categoryReducer,
	product: productReducer,
	user: userReducer,
	payment: paymentReducer,
	order: orderReducer,
	chat: chatReducer,
	dashboard: dashboardReducer,
	review: reviewReducer,
	cart: cartReducer,
});

// 4. Avvolgi la funzione rootReducer nel persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 5. Configura lo store usando il reducer persistente
const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
	devTools: process.env.NODE_ENV !== "production",
});

// 6. Crea e esporta il persistor
const persistor = persistStore(store);

// 7. Esporta sia lo store che il persistor
export { store, persistor };
