// @adesso/core-logic/src/store/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"; // Assicurati che il percorso all'istanza di axios sia corretto

// --- THUNKS ASINCRONI PER LE RECENSIONI ---

/**
 * Thunk per ottenere le recensioni di un singolo prodotto.
 * Fa una chiamata GET all'endpoint /products/:productId/reviews.
 */
export const getReviewsByProductId = createAsyncThunk(
	"reviews/getReviewsByProductId",
	async (productId, { rejectWithValue }) => {
		try {
			const { data } = await api.get(`/products/${productId}/reviews`);
			// Il backend dovrebbe restituire direttamente un array di recensioni
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore nel caricamento delle recensioni"
			);
		}
	}
);

/**
 * Thunk per inviare una nuova recensione per un prodotto.
 * Fa una chiamata POST all'endpoint /products/:productId/reviews.
 * Richiede autenticazione per l'utente che invia la recensione.
 */
export const submitProductReview = createAsyncThunk(
	"reviews/submitProductReview",
	async ({ productId, reviewData }, { rejectWithValue, getState }) => {
		try {
			// Questa parte presuppone che tu abbia uno userSlice nel tuo store Redux
			// che contiene le informazioni sull'utente e il suo token di autenticazione.
			const { user } = getState().user; // Accesso allo stato dell'utente

			if (!user || !user.userInfo || !user.userInfo.token) {
				return rejectWithValue(
					"Non autorizzato. Effettua il login per recensire."
				);
			}

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.userInfo.token}`, // Invia il token JWT
				},
			};

			// reviewData dovrebbe contenere { rating, comment }
			const { data } = await api.post(
				`/products/${productId}/reviews`,
				reviewData,
				config
			);
			return data; // Dovrebbe restituire un messaggio di successo e/o la recensione creata
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.error || "Errore nell'invio della recensione"
			);
		}
	}
);

// Definisce lo stato iniziale per le recensioni
const initialState = {
	reviews: [],
	loading: false, // Per il caricamento delle recensioni esistenti
	error: null, // Per errori nel caricamento delle recensioni
	submitLoading: false, // Per l'invio di una nuova recensione
	submitSuccess: false, // Per il successo dell'invio di una recensione
	submitError: null, // Per errori nell'invio di una recensione
};

const reviewSlice = createSlice({
	name: "reviews", // Il nome di questo slice sarà 'reviews' nello store
	initialState,
	reducers: {
		// Azione per resettare lo stato di invio della recensione
		reviewSubmitReset: (state) => {
			state.submitLoading = false;
			state.submitSuccess = false;
			state.submitError = null;
		},
		// Azione per pulire completamente lo stato delle recensioni (utile quando si lascia la pagina del prodotto)
		clearReviewsState: (state) => {
			state.reviews = [];
			state.loading = false;
			state.error = null;
			state.submitLoading = false;
			state.submitSuccess = false;
			state.submitError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Gestione di getReviewsByProductId
			.addCase(getReviewsByProductId.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getReviewsByProductId.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.reviews = payload; // Imposta l'array di recensioni
				state.error = null;
			})
			.addCase(getReviewsByProductId.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload;
				state.reviews = []; // Pulisci le recensioni in caso di errore
			})
			// Gestione di submitProductReview
			.addCase(submitProductReview.pending, (state) => {
				state.submitLoading = true;
				state.submitSuccess = false;
				state.submitError = null;
			})
			.addCase(submitProductReview.fulfilled, (state, { payload }) => {
				state.submitLoading = false;
				state.submitSuccess = true;
				state.submitError = null;
				// Nota: Invece di aggiungere qui la recensione, è spesso meglio ricaricare
				// l'intera lista di recensioni dopo un invio riuscito per assicurare
				// la consistenza con il backend e includere eventuali dati aggiunti dal server.
			})
			.addCase(submitProductReview.rejected, (state, { payload }) => {
				state.submitLoading = false;
				state.submitSuccess = false;
				state.submitError = payload;
			});
	},
});

export const { reviewSubmitReset, clearReviewsState } = reviewSlice.actions;
export default reviewSlice.reducer;
