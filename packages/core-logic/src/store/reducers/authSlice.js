import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { getUserProfile } from "./userSlice";

// --- THUNKS DI AUTENTICAZIONE ---

/**
 * Thunk per il login.
 * Chiama endpoint diversi a seconda del 'userType' specificato.
 */
export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password, userType }, { rejectWithValue }) => {
		try {
			let url;
			if (userType === "customer") {
				url = "/auth/customer-login";
			} else if (userType === "seller") {
				url = "/auth/seller-login";
			} else if (userType === "admin") {
				url = "/auth/admin-login";
			} else {
				return rejectWithValue("Tipo di utente non valido per il login.");
			}

			const { data } = await api.post(url, { email, password });
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore di autenticazione."
			);
		}
	}
);

/**
 * Thunk per la registrazione.
 * Chiama endpoint diversi a seconda del 'userType' specificato.
 */
export const register = createAsyncThunk(
	"auth/register",
	async ({ userType, ...userInfo }, { rejectWithValue }) => {
		try {
			let url;
			if (userType === "customer") {
				url = "/auth/customer-register";
			} else if (userType === "seller") {
				url = "/auth/seller-register";
			} else if (userType === "admin") {
				url = "/auth/admin-register";
			} else {
				return rejectWithValue(
					"Tipo di utente non valido per la registrazione."
				);
			}

			const { data } = await api.post(url, userInfo);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore di registrazione."
			);
		}
	}
);

/**
 * Thunk per il logout che chiama l'endpoint del backend.
 */
export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/auth/logout");
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
	userInfo: null, // userInfo non viene più caricato da localStorage
	authStatus: "idle",
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearAuthMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserProfile.pending, (state) => {
				state.authStatus = "loading";
			})
			.addCase(getUserProfile.fulfilled, (state, { payload }) => {
				state.authStatus = "succeeded";
				state.userInfo = payload;
			})
			.addCase(getUserProfile.rejected, (state) => {
				state.authStatus = "succeeded";
				state.userInfo = null;
			})
			.addMatcher(
				(action) =>
					["auth/login/fulfilled", "auth/register/fulfilled"].includes(
						action.type
					),
				(state, { payload }) => {
					state.loader = false;
					state.userInfo = payload.userInfo;
					state.successMessage = payload.message;
					state.errorMessage = "";
				}
			)
			.addMatcher(
				(action) => action.type === "auth/logout/fulfilled",
				(state, { payload }) => {
					state.loader = false;
					state.userInfo = null;
					state.successMessage = payload.message;
					state.errorMessage = "";
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.errorMessage = "";
					state.successMessage = "";
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
					state.successMessage = "";
					state.userInfo = null;
				}
			);
	},
});

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
