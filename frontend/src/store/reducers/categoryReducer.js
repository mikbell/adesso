import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; // Assicurati che il percorso sia corretto

// --- THUNKS ASINCRONI ---

/**
 * @description Thunk per aggiungere una nuova categoria. Invia dati di tipo FormData.
 * @param {FormData} categoryData - I dati della categoria, inclusa l'immagine.
 */
export const addCategory = createAsyncThunk(
	"category/addCategory",
	async (categoryData, { rejectWithValue }) => {
		try {
			// L'istanza 'api' gestirà l'header 'Authorization'.
			// Axios imposterà automaticamente 'Content-Type: multipart/form-data' per FormData.
			const { data } = await api.post("/categories/add", categoryData);
			return data; // La risposta attesa è { message: "...", category: {...} }
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || "Errore nell'aggiunta della categoria.";
			return rejectWithValue(errorMessage);
		}
	}
);

/**
 * @description Thunk per recuperare un elenco di categorie con paginazione e ricerca.
 * @param {object} params - Parametri per la query.
 * @param {number} params.page - Il numero della pagina.
 * @param {number} params.perPage - Il numero di elementi per pagina.
 * @param {string} params.search - Il termine di ricerca.
 */
export const getCategories = createAsyncThunk(
	"category/getCategories",
	async ({ page, perPage, search }, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/categories/get", {
				params: { page, perPage, search },
			});
			return data; // La risposta attesa è { categories: [...], totalCategories: ... }
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || "Errore nel recupero delle categorie.";
			return rejectWithValue(errorMessage);
		}
	}
);

// Lo stato iniziale per questo slice
const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	categories: [],
	totalCategories: 0,
};

export const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		// Reducer sincrono per pulire i messaggi di stato
		clearMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			// Gestisce lo stato 'fulfilled' per l'aggiunta di una categoria
			.addCase(addCategory.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.successMessage = payload.message;
				// Aggiunge la nuova categoria all'inizio dell'array per un feedback visivo immediato
				state.categories.unshift(payload.category);
				state.totalCategories += 1;
			})
			// Gestisce lo stato 'fulfilled' per il recupero delle categorie
			.addCase(getCategories.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.categories = payload.categories;
				state.totalCategories = payload.totalCategories;
			})
			// Usa un matcher per gestire tutti gli stati 'pending' degli thunk di 'category'
			.addMatcher(
				(action) =>
					action.type.startsWith("category/") &&
					action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.successMessage = ""; // Pulisce i messaggi all'inizio di una nuova azione
					state.errorMessage = "";
				}
			)
			// Usa un matcher per gestire tutti gli stati 'rejected' degli thunk di 'category'
			.addMatcher(
				(action) =>
					action.type.startsWith("category/") &&
					action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload; // 'payload' contiene il valore da rejectWithValue
				}
			);
	},
});

export const { clearMessages } = categorySlice.actions;
export default categorySlice.reducer;
