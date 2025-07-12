import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Importa le azioni da userSlice per la sincronizzazione
import { getUserProfile, updateUserProfile } from "./userSlice";

// --- THUNKS DI AUTENTICAZIONE ---
// Unico thunk per il login, che chiama la rotta unificata del backend
export const login = createAsyncThunk(
	"auth/login",
	async (info, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/auth/login", info);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore di autenticazione."
			);
		}
	}
);

// Thunk per la registrazione del venditore
export const register = createAsyncThunk(
	"auth/register",
	async (info, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/auth/register", info);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore di registrazione."
			);
		}
	}
);

// Thunk per il logout che chiama l'endpoint del backend
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
	userInfo: null,
	authStatus: "idle", // Stati possibili: 'idle', 'loading', 'succeeded'
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		// --- CASI SPECIFICI PER LA SINCRONIZZAZIONE ---
		builder
			// Gestisce lo stato del controllo di autenticazione iniziale
			.addCase(getUserProfile.pending, (state) => {
				state.authStatus = "loading";
			})
			.addCase(getUserProfile.fulfilled, (state, { payload }) => {
				state.authStatus = "succeeded";
				state.userInfo = payload;
			})
			.addCase(getUserProfile.rejected, (state) => {
				state.authStatus = "succeeded"; // Il controllo è terminato, anche se con fallimento
				state.userInfo = null;
			})
			// Ascolta l'aggiornamento del profilo da userSlice per mantenere i dati freschi
			.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
				state.userInfo = payload.profile;
			});

		// --- REGOLE GENERICHE PER LE AZIONI DI QUESTO SLICE ---
		builder
			.addMatcher(
				// Per login e registrazione andati a buon fine
				(action) =>
					["auth/login/fulfilled", "auth/register/fulfilled"].includes(
						action.type
					),
				(state, { payload }) => {
					state.loader = false;
					state.userInfo = payload.userInfo;
					state.successMessage = payload.message;
				}
			)
			.addMatcher(
				// Per il logout andato a buon fine
				(action) => action.type === "auth/logout/fulfilled",
				(state, { payload }) => {
					state.loader = false;
					state.userInfo = null;
					state.successMessage = payload.message;
				}
			)
			.addMatcher(
				// Per tutte le altre azioni 'auth' in pending
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.errorMessage = "";
					state.successMessage = "";
				}
			)
			.addMatcher(
				// Per tutte le altre azioni 'auth' fallite
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
					state.userInfo = null;
				}
			);
	},
});

export const { clearMessages } = authSlice.actions;
export default authSlice.reducer;
