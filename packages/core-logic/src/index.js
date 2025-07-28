/**
 * Questo file è il punto di ingresso principale per la libreria condivisa.
 * Esporta tutte le funzionalità necessarie (slice, azioni, thunk, API, utility)
 * in modo che le altre applicazioni nel monorepo possano importarle facilmente.
 */

// --- Esportazione della Configurazione API ---
export { default as api, setupAuthInterceptor } from "./api/api.js";

// --- Esportazione degli Slice, Azioni e Thunk Redux ---

// authSlice
export {
	clearAuthMessages,
	logout,
	login,
	register,
} from "./store/reducers/authSlice.js";

// userSlice
export {
	clearUserMessages,
	clearSellerDetails,
	fetchUsers,
	getUserProfile,
	getSellerDetails,
	updateUserProfile,
	updateSellerStatus,
	updatePassword,
	updateNotificationSettings,
	deleteSeller,
} from "./store/reducers/userSlice.js";

// productSlice
export {
	clearProductMessages,
	clearProductState,
	getProducts,
	getProductById,
	updateProduct,
	addProduct,
	deleteProduct,
	getLatestProducts,
	getDiscountedProducts,
	getTopRatedProducts,
} from "./store/reducers/productSlice.js";

// categorySlice
export {
	clearCategoryMessages,
	getCategories,
	addCategory,
	deleteCategory,
} from "./store/reducers/categorySlice.js";

// paymentSlice
export {
	clearPaymentMessages,
	getPaymentRequests,
	confirmPaymentRequest,
} from "./store/reducers/paymentSlice.js";

// orderSlice
export {
	createOrder,
	clearOrderMessages,
	getOrders,
	updateOrderStatus,
	getOrderDetails,
	clearOrderDetails,
} from "./store/reducers/orderSlice.js";

// chatSlice
export {
	getSellersForChat,
	getMessages,
	sendMessage,
	sellerSendMessage,
	getCustomersForSeller,
} from "./store/reducers/chatSlice.js";

// dashboardSlice
export { getSellerDashboardData } from "./store/reducers/dashboardSlice.js";

// reviewSlice
export {
	getReviewsByProductId,
	submitProductReview,
	reviewSubmitReset,
	clearReviewsState,
} from "./store/reducers/reviewSlice.js";

// cartSlice
export {
	fetchCart,
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCartAsync,
} from "./store/reducers/cartSlice.js";

// --- Esportazione dei Reducer (per costruire lo store nelle app) ---
export { default as authReducer } from "./store/reducers/authSlice.js";
export { default as userReducer } from "./store/reducers/userSlice.js";
export { default as productReducer } from "./store/reducers/productSlice.js";
export { default as categoryReducer } from "./store/reducers/categorySlice.js";
export { default as paymentReducer } from "./store/reducers/paymentSlice.js";
export { default as orderReducer } from "./store/reducers/orderSlice.js";
export { default as chatReducer } from "./store/reducers/chatSlice.js";
export { default as dashboardReducer } from "./store/reducers/dashboardSlice.js";
export { default as reviewReducer } from "./store/reducers/reviewSlice.js";
export { default as cartReducer } from "./store/reducers/cartSlice.js";

// --- Esportazione delle Utility ---
export { getStatusClasses } from "./utils/status.js";

// --- Esportazione dello Store e Persistor (se configurato) ---
export { store, persistor } from "./store/store.js"; // Assicurati che 'store.js' esporti anche 'persistor'

// --- Esportazione degli Hooks ---
export { useAuthForm } from "./hooks/useAuthForm.js";
