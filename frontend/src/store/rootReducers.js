import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import categorySlice from "./reducers/categorySlice";
import productSlice from "./reducers/productSlice";
import userSlice from "./reducers/userSlice";
import paymentSlice from "./reducers/paymentSlice";
import orderSlice from "./reducers/orderSlice";

const rootReducer = combineReducers({
	auth: authSlice,
	category: categorySlice,
	product: productSlice,
	user: userSlice,
	payment: paymentSlice,
	order: orderSlice,
});

export default rootReducer;
