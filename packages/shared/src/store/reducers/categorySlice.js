import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// --- THUNKS (invariati) ---
export const getCategories = createAsyncThunk(
	"category/getCategories",
	async ({ page, perPage, search }, { rejectWithValue }) => {
		try {
			const url = `/categories/get?page=${page}&perPage=${perPage}&search=${search}`;
			const { data } = await api.get(url);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Errore nel caricamento delle categorie"
			);
		}
	}
);

export const addCategory = createAsyncThunk(
	"category/addCategory",
	async (categoryData, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/categories/add", categoryData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Errore nell'aggiunta della categoria"
			);
		}
	}
);

export const deleteCategory = createAsyncThunk(
	"category/deleteCategory",
	async (categoryId, { rejectWithValue }) => {
		try {
			const { data } = await api.delete(`/categories/delete/${categoryId}`);
			return data;
		} catch (error) {
			return rejectWithValue(
				error.response.data.error || "Errore nell'eliminazione della categoria"
			);
		}
	}
);

// --- SLICE ---
const initialState = {
	loader: false,
	successMessage: "",
	errorMessage: "",
	categories: [],
	totalCategories: 0,
};

const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			// --- GESTIONE DEI CASI FULFILLED (SPECIFICI) ---
			.addCase(getCategories.fulfilled, (state, { payload }) => {
				state.categories = payload.categories;
				state.totalCategories = payload.totalCategories;
			})
			.addCase(addCategory.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
				state.categories = [payload.category, ...state.categories];
				state.totalCategories += 1;
			})
			.addCase(deleteCategory.fulfilled, (state, { payload }) => {
				state.successMessage = payload.message;
			})

			// --- GESTIONE GENERICA CON ADDMATCHER ---

			// Matcher per tutte le azioni .pending dello slice 'category'
			.addMatcher(
				(action) =>
					action.type.startsWith("category/") &&
					action.type.endsWith("/pending"),
				(state) => {
					state.loader = true;
					state.successMessage = "";
					state.errorMessage = "";
				}
			)
			// Matcher per tutte le azioni .fulfilled (per spegnere il loader)
			.addMatcher(
				(action) =>
					action.type.startsWith("category/") &&
					action.type.endsWith("/fulfilled"),
				(state) => {
					state.loader = false;
				}
			)
			// Matcher per tutte le azioni .rejected dello slice 'category'
			.addMatcher(
				(action) =>
					action.type.startsWith("category/") &&
					action.type.endsWith("/rejected"),
				(state, { payload }) => {
					state.loader = false;
					state.errorMessage = payload;
				}
			);
	},
});

export const { clearMessages } = categorySlice.actions;
export default categorySlice.reducer;
