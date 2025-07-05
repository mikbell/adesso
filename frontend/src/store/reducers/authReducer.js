import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; // Assuming this is your configured Axios instance

export const adminLogin = createAsyncThunk(
	"auth/admin_login",
	async (info, { rejectWithValue }) => {
		try {
			const { data } = await api.post("/admin-login", info, {
				withCredentials: true,
			});
			localStorage.setItem("token", data.token);
			return data;
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				return rejectWithValue(error.response.data.message);
			}
			return rejectWithValue("Errore durante il login.");
		}
	}
);

export const authReducer = createSlice({
	name: "auth",
	initialState: {
		successMessage: "",
		errorMessage: "",
		loader: false,
		userInfo: null,
	},
	reducers: {
		clearMessages: (state) => {
			state.successMessage = "";
			state.errorMessage = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(adminLogin.pending, (state) => {
				state.loader = true;
				state.errorMessage = "";
				state.successMessage = "";
			})
			.addCase(adminLogin.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.successMessage = payload.message || "Login successful!";
				state.userInfo = payload.admin;
				state.errorMessage = "";
			})
			.addCase(adminLogin.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload || "Login failed!";
				state.successMessage = "";
				state.userInfo = null;
			});
	},
});

export const { clearMessages } = authReducer.actions;

export default authReducer.reducer;
