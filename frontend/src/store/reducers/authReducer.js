import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

/**
 * @description Funzione helper per creare thunk di autenticazione, riducendo la duplicazione del codice.
 * @param {string} type - Il tipo di azione per il thunk (es. "auth/adminLogin").
 * @param {function} apiCall - La funzione che esegue la chiamata API.
 * @returns {AsyncThunk} Un'azione asincrona di Redux Toolkit.
 */
const createAuthThunk = (type, apiCall) => {
	return createAsyncThunk(type, async (info, { rejectWithValue }) => {
		try {
			const { data } = await apiCall(info);
			localStorage.setItem("token", data.token);
			return data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || "Si è verificato un errore sconosciuto.";
			return rejectWithValue(errorMessage);
		}
	});
};

// --- THUNKS ASINCRONI ---
export const adminLogin = createAuthThunk("auth/adminLogin", (info) =>
	api.post("/admin-login", info, { withCredentials: true })
);

export const sellerLogin = createAuthThunk("auth/sellerLogin", (info) =>
	api.post("/seller-login", info, { withCredentials: true })
);

export const sellerRegister = createAuthThunk("auth/sellerRegister", (info) =>
	api.post("/seller-register", info, { withCredentials: true })
);

export const getUserInfo = createAsyncThunk(
	"auth/getUserInfo",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/get-user", { withCredentials: true });
			return data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.error ||
				"Impossibile recuperare le informazioni utente.";
			return rejectWithValue(errorMessage);
		}
	}
);

/**
 * @description Decodifica un token JWT, controllandone la validità e la scadenza.
 * @param {string} token - Il token JWT da decodificare.
 * @returns {object|null} L'oggetto utente decodificato o null se il token non è valido o è scaduto.
 */
const getInfoFromToken = (token) => {
	if (!token || typeof token !== "string") return null;
	try {
		const decoded = jwtDecode(token);
		if (decoded.exp * 1000 < Date.now()) {
			localStorage.removeItem("token");
			return null;
		}
		return decoded;
	} catch (error) {
		console.error("Errore nella decodifica del token:", error);
		localStorage.removeItem("token");
		return null;
	}
};

const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	token: localStorage.getItem("token") || "",
	userInfo: getInfoFromToken(localStorage.getItem("token")),
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
		logout: (state) => {
			localStorage.removeItem("token");
			state.token = "";
			state.userInfo = null;
			state.successMessage = "Logout effettuato con successo.";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserInfo.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.userInfo = payload.userInfo;
			})
			.addMatcher(
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.errorMessage = "";
					state.successMessage = "";
				}
			)
			// --- BLOCCO CORRETTO ---
			.addMatcher(
				(action) =>
					action.type.endsWith("Login/fulfilled") ||
					action.type.endsWith("Register/fulfilled"),
				(state, { payload }) => {
					state.loader = false;
					state.successMessage = payload.message;
					state.token = payload.token;
					// Utilizziamo direttamente l'oggetto userInfo dalla risposta API.
					// Questo è più efficiente e previene l'errore di decodifica.
					state.userInfo = payload.userInfo;
				}
			)
			.addMatcher(
				(action) =>
					action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
					state.userInfo = null;
					state.token = "";
					localStorage.removeItem("token");
				}
			);
	},
});

export const { clearMessages, logout } = authSlice.actions;
export default authSlice.reducer;
