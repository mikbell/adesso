import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import categoryReducer from "./reducers/categoryReducer";

const rootReducer = combineReducers({
	auth: authReducer,
	category: categoryReducer,
});

export default rootReducer;
