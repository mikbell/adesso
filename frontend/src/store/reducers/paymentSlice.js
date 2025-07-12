import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getPaymentRequests = createAsyncThunk(
	"payment/getPaymentRequests",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/payment-requests");
			return data.paymentRequests;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const confirmPaymentRequest = createAsyncThunk(
	"payment/confirmPaymentRequest",
	async (paymentId, { rejectWithValue }) => {
		try {
			const { data } = await api.patch(
				`/payment-requests/${paymentId}/confirm`
			);
			return data.message;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	paymentRequests: [],
};

const paymentSlice = createSlice({
	name: "payment",
	initialState,
	reducers: {
		clearPaymentMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getPaymentRequests.fulfilled, (state, { payload }) => {
				state.paymentRequests = payload;
			})
			.addMatcher(
				(action) =>
					action.type.startsWith("payment/") &&
					action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("payment/") &&
					action.type.endsWith("/fulfilled"),
				(state, { payload }) => {
					state.loader = false;
					state.successMessage = payload;
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("payment/") &&
					action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
				}
			);
	},
});

export const { clearPaymentMessages } = paymentSlice.actions;
export default paymentSlice.reducer;
