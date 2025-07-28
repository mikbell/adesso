import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// --- NUOVA AZIONE ASINCRONA ---
/**
 * @description Crea un nuovo ordine dopo il checkout.
 */
export const createOrder = createAsyncThunk(
	"order/createOrder",
	async (orderData, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/orders", orderData);
			return data.message;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

// --- AZIONI ESISTENTI ---
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

export const clearOrderDetails = () => (dispatch) => {
	try {
		dispatch({ type: "order/clearOrderDetails" });
	} catch (error) {
		console.error(error);
	}
};

const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	orders: [],
	totalOrders: 0,
	orderDetails: null,
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
			// Gestione dell'azione createOrder
			.addCase(createOrder.pending, (state) => {
				state.loader = true;
			})
			.addCase(createOrder.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.successMessage = payload; // Qui payload è una stringa
			})
			.addCase(createOrder.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			})
			// Gestione dell'azione updateOrderStatus
			.addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.successMessage = payload; // Qui payload è una stringa
			})
			// Gestione dell'azione getOrders
			.addCase(getOrders.fulfilled, (state, { payload }) => {
				state.loader = false; // Spostato qui per una migliore granularità
				state.orders = payload.orders;
				state.totalOrders = payload.totalOrders;
				// Non assegnare qui il successMessage, perché non è un messaggio
			})
			// Gestione dell'azione getOrderDetails
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
			// Il matcher generico per pending va bene
			.addMatcher(
				(action) =>
					action.type.startsWith("order/") && action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					// È una buona pratica pulire i messaggi qui
					state.successMessage = "";
					state.errorMessage = "";
				}
			)
			// Sostituisci il matcher generico per rejected con un `addMatcher`
			// che gestisce solo i messaggi di errore
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
