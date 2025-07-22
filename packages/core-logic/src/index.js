/**
 * Questo file è il punto di ingresso principale per la libreria condivisa.
 * Esporta tutte le funzionalità necessarie (slice, azioni, thunk, API, utility)
 * in modo che le altre applicazioni nel monorepo possano importarle facilmente.
 */

// --- Esportazione della Configurazione API ---
export { default as api, setupAuthInterceptor } from "./api/api.js";

// --- Esportazione degli Slice e delle Azioni Redux ---

// Esporta sia l'azione sincrona 'clearMessages' sia il thunk 'logout' da authSlice
export { clearAuthMessages, logout } from "./store/reducers/authSlice.js";
// Esporta tutti i thunk di autenticazione
export { login, register } from "./store/reducers/authSlice.js";

// Esporta le azioni e i thunk da userSlice
export {
	clearUserMessages,
	clearSellerDetails,
} from "./store/reducers/userSlice.js";
export {
	fetchUsers,
	getUserProfile,
	getSellerDetails,
	updateUserProfile,
	updateSellerStatus,
	updatePassword,
	updateNotificationSettings,
	deleteSeller,
} from "./store/reducers/userSlice.js";

// Esporta le azioni e i thunk da productSlice
export {
	clearProductMessages,
	clearProductState,
} from "./store/reducers/productSlice.js";
export {
	getProducts,
	getProductById,
	updateProduct,
	addProduct,
	deleteProduct,
} from "./store/reducers/productSlice.js";

// Esporta le azioni e i thunk da categorySlice
export { clearCategoryMessages } from "./store/reducers/categorySlice.js";
export {
	getCategories,
	addCategory,
	deleteCategory,
} from "./store/reducers/categorySlice.js";

// Esporta le azioni e i thunk da paymentSlice
export { clearPaymentMessages } from "./store/reducers/paymentSlice.js";
export {
	getPaymentRequests,
	confirmPaymentRequest,
} from "./store/reducers/paymentSlice.js";

// Esporta le azioni e i thunk da orderSlice
export { clearOrderMessages } from "./store/reducers/orderSlice.js";
export {
	getOrders,
	updateOrderStatus,
	getOrderDetails,
	clearOrderDetails,
} from "./store/reducers/orderSlice.js";

// Esporta le azioni e i thunk da chatSlice
export {
	getSellersForChat,
	getMessages,
	sendMessage,
	sellerSendMessage,
	getCustomersForSeller,
} from "./store/reducers/chatSlice.js";

export { getSellerDashboardData } from "./store/reducers/dashboardSlice.js";

export {
	getReviewsByProductId,
	submitProductReview,
	reviewSubmitReset,
	clearReviewsState,
} from "./store/reducers/reviewSlice.js";

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

// --- Esportazione delle Utility ---
export { getStatusClasses } from "./utils/status.js";

// --- Esportazione dello Store ---
export { default as store } from "./store/store.js";

export { useAuthForm } from "./hooks/useAuthForm.js";
