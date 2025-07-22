import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Importa le azioni da userSlice per la sincronizzazione
import { getUserProfile, updateUserProfile } from "./userSlice";

// --- THUNKS DI AUTENTICAZIONE ---

/**
 * Thunk per il login.
 * Chiama endpoint diversi a seconda del 'userType' specificato.
 * @param {Object} info - Contiene email, password e userType ('customer', 'seller', o 'admin').
 */
export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password, userType }, { rejectWithValue }) => {
		try {
			let url;
			// Determina l'URL dell'endpoint in base al tipo di utente
			if (userType === "customer") {
				url = "/auth/customer-login"; // Endpoint per clienti
			} else if (userType === "seller") {
				url = "/auth/seller-login"; // Endpoint per venditori
			} else if (userType === "admin") {
				url = "/auth/admin-login"; // Endpoint per amministratori
			} else {
				// Se il tipo di utente non è valido, rifiuta la richiesta
				return rejectWithValue("Tipo di utente non valido per il login.");
			}

			const { data } = await api.post(url, { email, password });
			return data; // Il backend dovrebbe restituire userInfo e un messaggio
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
 * @param {Object} info - Contiene i dati di registrazione (es. name, email, password) e userType ('customer', 'seller', o 'admin').
 */
export const register = createAsyncThunk(
	"auth/register",
	async ({ userType, ...userInfo }, { rejectWithValue }) => {
		try {
			let url;
			// Determina l'URL dell'endpoint in base al tipo di utente
			if (userType === "customer") {
				url = "/auth/customer-register"; // Endpoint per registrazione cliente
			} else if (userType === "seller") {
				url = "/auth/seller-register"; // Endpoint per registrazione venditore
			} else if (userType === "admin") {
				url = "/auth/admin-register"; // Endpoint per registrazione amministratore
			} else {
				// Se il tipo di utente non è valido, rifiuta la richiesta
				return rejectWithValue(
					"Tipo di utente non valido per la registrazione."
				);
			}

			const { data } = await api.post(url, userInfo);
			return data; // Il backend dovrebbe restituire userInfo e un messaggio
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore di registrazione."
			);
		}
	}
);

/**
 * Thunk per il logout che chiama l'endpoint del backend.
 * Si presume che l'endpoint di logout sia unificato per tutti i tipi di utente.
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
	userInfo: null,
	authStatus: "idle", // Stati possibili: 'idle', 'loading', 'succeeded'
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
		// --- CASI SPECIFICI PER LA SINCRONIZZAZIONE ---
		builder
			// Gestisce lo stato del controllo di autenticazione iniziale tramite getUserProfile
			.addCase(getUserProfile.pending, (state) => {
				state.authStatus = "loading";
			})
			.addCase(getUserProfile.fulfilled, (state, { payload }) => {
				state.authStatus = "succeeded";
				state.userInfo = payload; // Assumi che payload sia l'oggetto userInfo
			})
			.addCase(getUserProfile.rejected, (state) => {
				state.authStatus = "succeeded"; // Il controllo è terminato, anche se con fallimento
				state.userInfo = null;
			})
			// Ascolta l'aggiornamento del profilo da userSlice per mantenere i dati freschi in authSlice
			.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
				state.userInfo = payload.profile; // Assumi che payload.profile sia l'oggetto userInfo aggiornato
			});

		// --- REGOLE GENERICHE PER LE AZIONI DI QUESTO SLICE ---
		builder
			.addMatcher(
				// Per login e registrazione andati a buon fine (qualsiasi tipo di utente)
				(action) =>
					["auth/login/fulfilled", "auth/register/fulfilled"].includes(
						action.type
					),
				(state, { payload }) => {
					state.loader = false;
					// Il backend deve restituire un oggetto { userInfo: {...}, message: "..." }
					state.userInfo = payload.userInfo;
					state.successMessage = payload.message;
					state.errorMessage = ""; // Pulisci eventuali errori precedenti
				}
			)
			.addMatcher(
				// Per il logout andato a buon fine
				(action) => action.type === "auth/logout/fulfilled",
				(state, { payload }) => {
					state.loader = false;
					state.userInfo = null; // Pulisci i dati utente al logout
					state.successMessage = payload.message;
					state.errorMessage = ""; // Pulisci eventuali errori precedenti
				}
			)
			.addMatcher(
				// Per tutte le azioni 'auth' in pending (caricamento)
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.errorMessage = "";
					state.successMessage = "";
				}
			)
			.addMatcher(
				// Per tutte le azioni 'auth' fallite (rejected)
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
					state.successMessage = ""; // Pulisci eventuali messaggi di successo
					state.userInfo = null; // In caso di errore di autenticazione, pulisci userInfo
				}
			);
	},
});

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
