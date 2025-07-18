// src/hooks/useAuthForm.js
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearAuthMessages } from "@adesso/core-logic";

/**
 * Un hook custom per gestire la logica dei form di autenticazione.
 * @param {object} config - Oggetto di configurazione.
 * @param {object} config.initialState - Lo stato iniziale per i campi del form.
 * @param {function} config.authAction - L'azione Redux da dispatchare (es. sellerLogin).
 * @param {function} config.validationRules - Una funzione che valida il form e restituisce un oggetto di errori.
 * @param {string} config.successRedirectPath - Il percorso a cui reindirizzare in caso di successo.
 */
export const useAuthForm = ({
	initialState,
	authAction,
	validationRules,
	successRedirectPath,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 1. Stato del form e degli errori
	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	// 2. Dati dallo store Redux
	const { loader, successMessage, errorMessage, userInfo } = useSelector(
		(state) => state.auth
	);

	// 3. Funzione generica per il cambio degli input
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	// 4. Funzione generica per il submit
	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = validationRules(formData);
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			dispatch(authAction(formData));
		}
	};

	// 5. Effetti per notifiche e redirect (invariati)
	useEffect(() => {
		if (successMessage) {
			toast.success(successMessage);
			dispatch(clearAuthMessages());
		}
		if (errorMessage) {
			toast.error(errorMessage);
			dispatch(clearAuthMessages());
		}
	}, [successMessage, errorMessage, dispatch]);

	useEffect(() => {
		if (userInfo) {
			navigate(successRedirectPath);
		}
	}, [userInfo, navigate, successRedirectPath]);

	// 6. Restituisce tutto ciò che serve al componente
	return {
		formData,
		errors,
		loader,
		handleChange,
		handleSubmit,
	};
};
