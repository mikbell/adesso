import axios from "axios";

// 1. Crea e esporta l'istanza di Axios come prima
const api = axios.create({
	baseURL: "http://localhost:3000/api",
	withCredentials: true,
});

// 2. Crea ed esporta una funzione per configurare l'interceptor
//    Questa funzione ACCETTA lo store come argomento.
export const setupAuthInterceptor = (store) => {
	api.interceptors.request.use(
		(config) => {
			// 3. La logica per prendere il token ora usa lo store che è stato "iniettato"
			const token = store.getState().auth.token;
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);
};

export default api;
