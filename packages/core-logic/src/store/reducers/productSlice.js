import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"; // Assicurati che il percorso all'istanza di axios sia corretto

// --- THUNKS ASINCRONI PER I PRODOTTI ---

/**
 * Thunk per ottenere i prodotti con paginazione, ricerca, filtri e ordinamento.
 * Fa una chiamata GET all'endpoint /products/get.
 */
export const getProducts = createAsyncThunk(
	"products/getProducts",
	async (
		{
			page = 1,
			perPage = 12,
			search = "",
			categories = [],
			priceRange = [0, Infinity],
			rating = 0,
			sortBy = "",
		},
		{ rejectWithValue }
	) => {
		try {
			// Costruisce l'URL con i parametri di query per la richiesta
			// Assicurati che il tuo backend sia in grado di leggere e processare questi parametri
			const params = new URLSearchParams();
			params.append("page", page);
			params.append("perPage", perPage);
			if (search) params.append("search", search);
			// Se 'Tutte' è selezionato o nessun'altra categoria, non inviare il parametro category
			if (
				categories.length > 0 &&
				!(categories.length === 1 && categories[0] === "Tutte")
			) {
				categories.forEach((cat) => params.append("category", cat));
			}
			if (priceRange[0] > 0) params.append("minPrice", priceRange[0]);
			if (priceRange[1] < Infinity) params.append("maxPrice", priceRange[1]);
			if (rating > 0) params.append("rating", rating);
			if (sortBy) params.append("sortBy", sortBy);

			const url = `/products/get?${params.toString()}`;
			const { data } = await api.get(url);
			// Restituisce i dati ricevuti (dovrebbero includere products e totalProducts)
			return data;
		} catch (error) {
			// In caso di errore, restituisce un messaggio di errore
			return rejectWithValue(
				error.response?.data?.error || "Errore nel caricamento dei prodotti"
			);
		}
	}
);

/**
 * Thunk per ottenere un singolo prodotto tramite slug o ID.
 * Fa una chiamata GET all'endpoint /products/get/:slug.
 */
export const getProductById = createAsyncThunk(
	"products/getProductById",
	async (slug, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/products/get/${slug}`);
			// Il backend dovrebbe restituire { product: ... }
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Prodotto non trovato"
			);
		}
	}
);

/**
 * Thunk per aggiornare un prodotto.
 * Fa una chiamata PUT all'endpoint /products/update/:slug.
 */
export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ slug, formData }, { rejectWithValue }) => {
		try {
			const { data } = await api.put(`/products/update/${slug}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore nell'aggiornamento del prodotto"
			);
		}
	}
);

/**
 * Thunk per aggiungere un nuovo prodotto.
 * Fa una chiamata POST all'endpoint /products/add, inviando dati di tipo multipart/form-data.
 */
export const addProduct = createAsyncThunk(
	"products/addProduct",
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
 * Fa una chiamata DELETE all'endpoint /products/delete/:slug.
 */
export const deleteProduct = createAsyncThunk(
	"products/deleteProduct",
	async (slug, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(`/products/delete/${slug}`);
			// Aggiungi lo slug del prodotto eliminato al payload per il filtraggio
			return { ...data, deletedSlug: slug };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore nell'eliminazione del prodotto"
			);
		}
	}
);

// Definisce lo stato iniziale per i prodotti
const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	products: [], // Qui verranno memorizzati i prodotti filtrati/paginati
	product: null,
	totalProducts: 0, // Qui verrà memorizzato il conteggio totale dei prodotti (per la paginazione)
};

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		clearProductMessages: (state) => {
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
			// MODIFICATO: Accedi a payload.product perché il backend restituisce { product: ... }
			.addCase(getProductById.fulfilled, (state, { payload }) => {
				state.product = payload.product;
			})
			.addCase(addProduct.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
				// Non aggiungiamo qui il prodotto alla lista 'products'
				// perché la lista è gestita dal fetching con filtri e paginazione.
				// Una nuova chiamata a getProducts aggiornerà la lista.
				// state.products = [payload.product, ...state.products]; // Rimuovi o commenta questa riga
				// state.totalProducts += 1; // Rimuovi o commenta questa riga
			})
			.addCase(updateProduct.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
				// Opzionale: Se payload.product è l'oggetto aggiornato, potresti aggiornarlo nella lista products qui
				// Oppure, se stai aggiornando la vista dettagli, non è necessario aggiornare la lista generale
			})
			// MODIFICATO: Filtra usando deletedSlug dal payload
			.addCase(deleteProduct.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
				// Filtra i prodotti rimuovendo quello con lo slug eliminato
				state.products = state.products.filter(
					(product) => product.slug !== payload.deletedSlug
				);
				state.totalProducts -= 1;
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

export const { clearProductMessages, clearProductState } = productSlice.actions;
export default productSlice.reducer;
