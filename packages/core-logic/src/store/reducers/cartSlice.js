import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import toast from "react-hot-toast";

const initialState = {
	items: [],
	wishlist: [],
	total: 0,
	loader: false,
	successMessage: "",
	errorMessage: "",
	shippingFee: 0,
	outOfStockProducts: [],
};

// --- Azioni Asincrone per interagire con il backend ---

// Azione per caricare il carrello dell'utente dal server (USA IL LOADER GLOBALE)
export const fetchCart = createAsyncThunk(
	"cart/fetchCart",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/cart");
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Errore nel recupero del carrello"
			);
		}
	}
);

// Azione per aggiungere un prodotto al carrello sul server (NON DISPATCHA fetchCart)
export const addToCart = createAsyncThunk(
	"cart/addToCart",
	async (productData, { rejectWithValue }) => {
		// Rimosso 'dispatch'
		try {
			const response = await api.post("/cart/add", productData);
			toast.success("Prodotto aggiunto al carrello!");
			// Il backend dovrebbe restituire il carrello aggiornato
			return response.data; // Restituisce i dati del carrello aggiornato
		} catch (error) {
			toast.error("Errore nell'aggiunta al carrello.");
			return rejectWithValue(
				error.response.data.error || "Errore nell'aggiunta al carrello"
			);
		}
	}
);

// Azione per rimuovere un prodotto dal carrello sul server (NON DISPATCHA fetchCart)
export const removeFromCart = createAsyncThunk(
	"cart/removeFromCart",
	async (productId, { rejectWithValue }) => {
		// Rimosso 'dispatch'
		try {
			const response = await api.delete(`/cart/remove/${productId}`);
			toast.success("Prodotto rimosso dal carrello!");
			// Il backend dovrebbe restituire il carrello aggiornato
			return response.data; // Restituisce i dati del carrello aggiornato
		} catch (error) {
			toast.error("Errore nella rimozione dal carrello.");
			return rejectWithValue(
				error.response.data.error || "Errore nella rimozione dal carrello"
			);
		}
	}
);

// Azione per aggiornare la quantità di un prodotto sul server (NON DISPATCHA fetchCart)
export const updateQuantity = createAsyncThunk(
	"cart/updateQuantity",
	async ({ productId, quantity }, { rejectWithValue }) => {
		// Rimosso 'dispatch'
		try {
			const response = await api.put("/cart/update-quantity", {
				productId,
				quantity,
			});
			// Il backend dovrebbe restituire il carrello aggiornato
			return response.data; // Restituisce i dati del carrello aggiornato
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Errore nell'aggiornamento della quantità"
			);
		}
	}
);

// Azione per svuotare il carrello sul server (NON DISPATCHA fetchCart)
export const clearCartAsync = createAsyncThunk(
	"cart/clearCartAsync",
	async (_, { rejectWithValue }) => {
		// Rimosso 'dispatch'
		try {
			await api.delete("/cart/clear");
			toast.success("Carrello svuotato!");
			return { cartItems: [], total: 0, quantity: 0 }; // Restituisce lo stato vuoto
		} catch (error) {
			toast.error("Errore nello svuotare il carrello.");
			return rejectWithValue(
				error.response.data.error || "Errore nello svuotare il carrello"
			);
		}
	}
);

// --- SLICE: CONFIGURAZIONE E RIDUTTORI ---

export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		clearCartMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
		clearCart: (state) => {
			// Questo è il reducer sincrono per svuotare il carrello localmente
			state.items = [];
			state.total = 0;
			state.shippingFee = 0;
			state.outOfStockProducts = []; // Assicurati di resettare anche questo
		},
	},
	extraReducers: (builder) => {
		builder
			// Gestione del fetching del carrello (USA IL LOADER GLOBALE)
			.addCase(fetchCart.pending, (state) => {
				state.loader = true;
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.loader = false;
				state.items = action.payload.cartItems;
				state.total = action.payload.total;
				// Assumi che il backend restituisca il subtotale, e non il totale già calcolato
				state.shippingFee = action.payload.shippingFee || 0; // Se il backend restituisce shippingFee
				state.outOfStockProducts = action.payload.outOfStockProducts || []; // Se il backend restituisce outOfStockProducts
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.loader = false;
				state.errorMessage = action.payload;
			})

			// Gestione dell'aggiunta al carrello (AGGIORNA LO STATO DIRETTAMENTE)
			.addCase(addToCart.fulfilled, (state, action) => {
				// Il backend dovrebbe restituire il carrello aggiornato
				state.items = action.payload.cartItems;
				state.total = action.payload.total;
				state.shippingFee = action.payload.shippingFee || 0;
				state.outOfStockProducts = action.payload.outOfStockProducts || [];
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.errorMessage = action.payload;
			})

			// Gestione della rimozione (AGGIORNA LO STATO DIRETTAMENTE)
			.addCase(removeFromCart.fulfilled, (state, action) => {
				// Il backend dovrebbe restituire il carrello aggiornato
				state.items = action.payload.cartItems;
				state.total = action.payload.total;
				state.shippingFee = action.payload.shippingFee || 0;
				state.outOfStockProducts = action.payload.outOfStockProducts || [];
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.errorMessage = action.payload;
			})

			// Gestione dell'aggiornamento quantità (AGGIORNA LO STATO DIRETTAMENTE)
			.addCase(updateQuantity.fulfilled, (state, action) => {
				// Il backend dovrebbe restituire il carrello aggiornato
				state.items = action.payload.cartItems;
				state.total = action.payload.total;
				state.shippingFee = action.payload.shippingFee || 0;
				state.outOfStockProducts = action.payload.outOfStockProducts || [];
			})
			.addCase(updateQuantity.rejected, (state, action) => {
				state.errorMessage = action.payload;
			})

			// Gestione dello svuotamento del carrello asincrono (AGGIORNA LO STATO DIRETTAMENTE)
			.addCase(clearCartAsync.fulfilled, (state, action) => {
				state.items = action.payload.cartItems;
				state.total = action.payload.total;
				state.shippingFee = action.payload.shippingFee;
				state.outOfStockProducts = [];
			})
			.addCase(clearCartAsync.rejected, (state, action) => {
				state.errorMessage = action.payload;
			})
	},
});

export const { clearCartMessages, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
