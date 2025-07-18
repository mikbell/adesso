import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getOrders = createAsyncThunk(
	"order/getOrders",
	async ({ page, perPage, search, status }, { rejectWithValue }) => {
		try {
			const statusQuery = status === "all" ? "" : `&status=${status}`;
			const url = `/orders?page=${page}&perPage=${perPage}&search=${search}${statusQuery}`;
			const { data } = await api.get(url);
			return data;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const updateOrderStatus = createAsyncThunk(
	"order/updateOrderStatus",
	async ({ orderId, status }, { rejectWithValue }) => {
		try {
			const { data } = await api.patch(`/orders/${orderId}/status`, { status });
			return data.message;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const getOrderDetails = createAsyncThunk(
	"order/getOrderDetails",
	async (orderId, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/orders/${orderId}`);
			return data.orderDetails;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	orders: [],
	totalOrders: 0,
	orderDetails: null, // -> Aggiunto per i dettagli del singolo ordine
};

const orderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {
		clearOrderMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
		clearOrderDetails: (state) => {
			state.orderDetails = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getOrders.fulfilled, (state, { payload }) => {
				state.orders = payload.orders;
				state.totalOrders = payload.totalOrders;
			})
			.addCase(getOrderDetails.pending, (state) => {
				state.loader = true;
			})
			.addCase(getOrderDetails.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.orderDetails = payload;
			})
			.addCase(getOrderDetails.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			})
			.addMatcher(
				(action) =>
					action.type.startsWith("order/") && action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("order/") &&
					action.type.endsWith("/fulfilled"),
				(state, { payload }) => {
					state.loader = false;
					state.successMessage = payload;
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("order/") && action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
				}
			);
	},
});

export const { clearOrderMessages } = orderSlice.actions;
export default orderSlice.reducer;
