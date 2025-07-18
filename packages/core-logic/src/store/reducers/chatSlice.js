import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getSellersForChat = createAsyncThunk(
	"chat/getSellers",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/chat/sellers");
			return data.sellers;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const getMessages = createAsyncThunk(
	"chat/getMessages",
	async (sellerId, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/chat/messages/${sellerId}`);
			return data.messages;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const sendMessage = createAsyncThunk(
	"chat/sendMessage",
	async ({ sellerId, message }, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/chat/send-message", {
				sellerId,
				message,
			});
			return data.message;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const getCustomersForSeller = createAsyncThunk(
	"chat/getCustomers",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/chat/seller/customers");
			return data.customers;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

export const sellerSendMessage = createAsyncThunk(
	"chat/sellerSendMessage",
	async ({ customerId, message }, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/chat/seller/send-message", {
				customerId,
				message,
			});
			return data.message;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

const initialState = {
	loader: false,
	errorMessage: "",
	sellers: [],
	messages: [],
};

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		/* Puoi aggiungere qui reducer per la chat in tempo reale con Socket.IO */
	},
	extraReducers: (builder) => {
		builder
			.addCase(getSellersForChat.pending, (state) => {
				state.loader = true;
			})
			.addCase(getSellersForChat.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.sellers = payload;
			})
			.addCase(getMessages.fulfilled, (state, { payload }) => {
				state.messages = payload;
			})
			.addCase(sendMessage.fulfilled, (state, { payload }) => {
				state.messages.push(payload);
			})
			.addMatcher(
				(action) =>
					action.type.startsWith("chat/") && action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
				}
			);
	},
});

export default chatSlice.reducer;
