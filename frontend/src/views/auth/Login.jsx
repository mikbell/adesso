import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import CustomInput from '../../components/shared/CustomInput';
import Button from '../../components/shared/Button';
import { sellerLogin, clearMessages } from '../../store/reducers/authReducer';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Seleziona tutto lo stato necessario da Redux
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
        // Pulisce l'errore per il campo specifico mentre l'utente scrive
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "L'email è richiesta.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Formato email non valido.";
        }
        if (!formData.password.trim()) {
            newErrors.password = "La password è richiesta.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // La logica di submit è ora più semplice: basta dispatchare l'azione.
        dispatch(sellerLogin(formData));
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
    // Questo si attiva quando `userInfo` cambia, indicando un login riuscito.
    useEffect(() => {
        if (userInfo && userInfo.role === 'seller') {
            navigate('/seller/dashboard');
        }
    }, [userInfo, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 mb-2'>Bentornato!</h2>
                    <p className='text-gray-600 italic'>Accedi al tuo account.</p>
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
                    <div className="text-right mb-6">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Hai dimenticato la password?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        loading={loader}
                        disabled={loader}
                    >
                        {loader ? 'Accesso in corso...' : 'Accedi'}
                    </Button>
                    <div className="w-full flex justify-center items-center my-5">
                        <div className="w-[45%] h-[1px] bg-gray-300"></div>
                        <p className="px-2 text-gray-600 text-sm">Oppure</p>
                        <div className="w-[45%] h-[1px] bg-gray-300"></div>
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        <Button variant="google" size="lg"><FaGoogle /></Button>
                        <Button variant="facebook" size="lg"><FaFacebook /></Button>
                    </div>
                </form>
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Non hai un account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">Registrati qui</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
