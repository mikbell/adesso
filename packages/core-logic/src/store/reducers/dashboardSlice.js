import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getSellerDashboardData = createAsyncThunk(
	"dashboard/getSellerData",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await api.get("/dashboard/seller");
			return data.dashboardData;
		} catch (error) {
			return rejectWithValue(error.response.data.error);
		}
	}
);

const initialState = {
	loader: false,
	errorMessage: "",
	dashboardData: {
		totalSales: 0,
		totalProducts: 0,
		totalOrders: 0,
		pendingOrders: 0,
		recentOrders: [],
		recentMessages: [],
	},
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getSellerDashboardData.pending, (state) => {
				state.loader = true;
			})
			.addCase(getSellerDashboardData.fulfilled, (state, { payload }) => {
				state.loader = false;
				state.dashboardData = payload;
			})
			.addCase(getSellerDashboardData.rejected, (state, { payload }) => {
				state.loader = false;
				state.errorMessage = payload;
			});
	},
});

export default dashboardSlice.reducer;
