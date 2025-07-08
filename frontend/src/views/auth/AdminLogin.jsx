import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import CustomInput from '../../components/shared/CustomInput';
import Button from '../../components/shared/Button';
import { adminLogin, clearMessages } from '../../store/reducers/authReducer';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Seleziona tutti i dati necessari, incluso userInfo per il redirect.
    const { loader, successMessage, errorMessage, userInfo } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // 1. Esegue la validazione
        if (!formData.email.trim()) {
            newErrors.email = "L'email è richiesta.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Formato email non valido.";
        }
        if (!formData.password.trim()) {
            newErrors.password = "La password è richiesta.";
        }

        // 2. Se ci sono errori, li imposta e interrompe l'esecuzione.
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 3. Se la validazione ha successo, invia la richiesta.
        dispatch(adminLogin(formData));
    };

    // --- EFFETTO PER LE NOTIFICHE (TOAST) ---
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearMessages());
        }
    }, [successMessage, errorMessage, dispatch]);

    // --- EFFETTO PER IL REINDIRIZZAMENTO ---
    // Si attiva quando `userInfo` cambia, indicando un login riuscito.
    useEffect(() => {
        if (userInfo && userInfo.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [userInfo, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 mb-2'>Pannello Admin</h2>
                    <p className='text-gray-600 italic'>Accedi al tuo account</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <CustomInput
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Inserisci la tua email"
                        value={formData.email}
                        onChange={handleChange}
                        errorMessage={errors.email}
                    />
                    <CustomInput
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Inserisci la tua password"
                        value={formData.password}
                        onChange={handleChange}
                        errorMessage={errors.password}
                    />
                    <div className="mt-6">
                        <Button
                            type="submit"
                            className="w-full"
                            loading={loader}
                            disabled={loader}
                        >
                            {loader ? 'Accesso in corso...' : 'Accedi'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
