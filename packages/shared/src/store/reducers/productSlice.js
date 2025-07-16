import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"; // Assicurati che il percorso all'istanza di axios sia corretto

// --- THUNKS ASINCRONI PER I PRODOTTI ---

/**
 * Thunk per ottenere i prodotti con paginazione e ricerca.
 * Fa una chiamata GET all'endpoint /products/get.
 */
export const getProducts = createAsyncThunk(
	"product/getProducts",
	async ({ page, perPage, search }, { rejectWithValue }) => {
		try {
			// Costruisce l'URL con i parametri di query per la richiesta
			const url = `/products/get?page=${page}&perPage=${perPage}&search=${search}`;
			const { data } = await api.get(url);
			// Restituisce i dati ricevuti (dovrebbero includere prodotti e totale)
			return data;
		} catch (error) {
			// In caso di errore, restituisce un messaggio di errore
			return rejectWithValue(
				error.response?.data?.error || "Errore nel caricamento dei prodotti"
			);
		}
	}
);

// Thunk per ottenere un singolo prodotto tramite ID
export const getProductById = createAsyncThunk(
	"product/getProductById",
	async (productId, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/products/get/${productId}`);
			return data; // Il backend dovrebbe restituire { product: ... }
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Prodotto non trovato"
			);
		}
	}
);

// Thunk per aggiornare un prodotto
export const updateProduct = createAsyncThunk(
	"product/updateProduct",
	async ({ productId, formData }, { rejectWithValue }) => {
		try {
			const { data } = await api.put(
				`/products/update/${productId}`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Errore nell'aggiornamento"
			);
		}
	}
);

/**
 * Thunk per aggiungere un nuovo prodotto.
 * Fa una chiamata POST all'endpoint /products/add, inviando dati di tipo multipart/form-data.
 */
export const addProduct = createAsyncThunk(
	"product/addProduct",
	async (productData, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/products/add", productData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore nell'aggiunta del prodotto"
			);
		}
	}
);

/**
 * Thunk per eliminare un prodotto.
 * Fa una chiamata DELETE all'endpoint /products/delete/:productId.
 */
export const deleteProduct = createAsyncThunk(
	"product/deleteProduct",
	async (productId, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(`/products/delete/${productId}`);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore nell'eliminazione del prodotto"
			);
		}
	}
);

// --- SLICE ---

// Definisce lo stato iniziale per i prodotti
const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	products: [],
	product: null, // Assicurati che 'product' sia in initialState
	totalProducts: 0,
};

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
		clearProductState: (state) => {
			state.product = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// --- GESTIONE DEI CASI FULFILLED (SPECIFICI) ---
			.addCase(getProducts.fulfilled, (state, { payload }) => {
				state.products = payload.products;
				state.totalProducts = payload.totalProducts;
			})
			.addCase(getProductById.fulfilled, (state, { payload }) => {
				state.product = payload.product;
			})
			.addCase(addProduct.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
				state.products = [payload.product, ...state.products];
				state.totalProducts += 1;
			})
			.addCase(updateProduct.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
			})
			.addCase(deleteProduct.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
			})

			// --- GESTIONE GENERICA CON ADDMATCHER ---

			// Matcher per tutte le azioni .pending dello slice 'product'
			.addMatcher(
				(action) =>
					action.type.startsWith("product/") &&
					action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.successMessage = "";
					state.errorMessage = "";
				}
			)
			// Matcher per tutte le azioni .rejected dello slice 'product'
			.addMatcher(
				(action) =>
					action.type.startsWith("product/") &&
					action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
				}
			)
			// Matcher per tutte le azioni .fulfilled (per spegnere il loader)
			.addMatcher(
				(action) =>
					action.type.startsWith("product/") &&
					action.type.endsWith("/fulfilled"),
				(state) => {
					state.loader = false;
				}
			);
	},
});

export const { clearMessages, clearProductState } = productSlice.actions;
export default productSlice.reducer;
