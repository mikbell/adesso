// store/reducers/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// -> Tutti i thunk per il profilo ora vivono qui e usano il prefisso 'users/'

export const fetchUsers = createAsyncThunk(
	"user/fetchUsers",
	async (params = {}, { rejectWithValue }) => {
		try {
			const {
				page = 1,
				perPage = 10,
				search = "",
				role = "",
				status = "",
			} = params;
			// Costruisce la query string solo con i parametri forniti
			const query = new URLSearchParams({
				page,
				perPage,
				search,
				role,
				status,
			}).toString();
			const { data } = await api.get(`/users?${query}`);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const getUserProfile = createAsyncThunk(
	"users/getUserProfile",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/users/profile");
			return data.userInfo;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const getSellerDetails = createAsyncThunk(
	"user/getSellerDetails",
	async (sellerId, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/users/${sellerId}`);
			return data.userDetails;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const updateSellerStatus = createAsyncThunk(
	"user/updateSellerStatus",
	async ({ sellerId, status }, { rejectWithValue }) => {
		try {
			const { data } = await api.patch(`/users/${sellerId}/status`, { status });
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const getSellers = createAsyncThunk(
	"user/getSellers",
	async ({ page, perPage, search }, { rejectWithValue }) => {
		try {
			const url = `/users?role=seller&page=${page}&perPage=${perPage}&search=${search}`;
			const { data } = await api.get(url);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const getDeactivatedSellers = createAsyncThunk(
	"user/getDeactivatedSellers",
	async ({ page, perPage, search }, { rejectWithValue }) => {
		try {
			// -> Chiama l'API passando i due stati separati da una virgola
			const statuses = "deactive,inactive";
			const url = `/users?role=seller&status=${statuses}&page=${page}&perPage=${perPage}&search=${search}`;
			const { data } = await api.get(url);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const getSellerRequests = createAsyncThunk(
	"user/getSellerRequests",
	async ({ page, perPage, search }, { rejectWithValue }) => {
		try {
			// -> Chiama l'API specificando role='seller' e status='pending'
			const url = `/users?role=seller&status=pending&page=${page}&perPage=${perPage}&search=${search}`;
			const { data } = await api.get(url);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const updateUserProfile = createAsyncThunk(
	"users/updateUserProfile",
	async (profileData, { rejectWithValue }) => {
		try {
			const { data } = await api.put("/users/profile/update", profileData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const updatePassword = createAsyncThunk(
	"users/updatePassword",
	async (passwords, { rejectWithValue }) => {
		try {
			const { data } = await api.patch("/users/profile/password", passwords);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const updateNotificationSettings = createAsyncThunk(
	"users/updateNotificationSettings",
	async (settings, { rejectWithValue }) => {
		try {
			const { data } = await api.patch(
				"/users/profile/notifications",
				settings
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

export const deleteSeller = createAsyncThunk(
	"users/deleteSeller",
	async (sellerId, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(`/users/${sellerId}`);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.error);
		}
	}
);

// --- SLICE ---
const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	users: [],
	totalUsers: 0,
	sellerDetails: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearUserMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
		clearSellerDetails: (state) => {
			state.sellerDetails = null;
		},
	},
	// 3. extraReducers ora usa solo addCase per chiarezza e specificità
	extraReducers: (builder) => {
		builder
			// Gestione del fetch generico di utenti
			.addCase(fetchUsers.pending, (state) => {
				state.loader = true;
			})
			.addCase(fetchUsers.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.users = payload.users;
				state.totalUsers = payload.totalUsers;
			})
			.addCase(fetchUsers.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			})

			// Gestione dei dettagli del singolo venditore
			.addCase(getSellerDetails.pending, (state) => {
				state.loader = true;
			})
			.addCase(getSellerDetails.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.sellerDetails = payload;
			})
			.addCase(getSellerDetails.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			})

			// Gestione dell'aggiornamento dello stato
			.addCase(updateSellerStatus.pending, (state) => {
				state.loader = true;
			})
			.addCase(updateSellerStatus.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.sellerDetails = payload.userDetails;
				state.successMessage = payload.message;
			})
			.addCase(updateSellerStatus.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			})

			// Gestione dell'eliminazione del venditore
			.addCase(deleteSeller.pending, (state) => {
				state.loader = true;
			})
			.addCase(deleteSeller.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.successMessage = payload.message;
			})
			.addCase(deleteSeller.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			});

		// Puoi aggiungere qui i case per updateUserProfile, updatePassword, etc.
		// se hanno bisogno di gestire lo stato di questo slice (es. loader, messaggi)
	},
});

export const { clearUserMessages, clearSellerDetails } = userSlice.actions;
export default userSlice.reducer;
