import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import CustomInput from '../../components/shared/CustomInput';
import Button from '../../components/shared/Button';
import { sellerRegister, clearMessages } from '../../store/reducers/authReducer';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Selezioniamo anche userInfo per sapere quando la registrazione (e il login automatico) ha avuto successo.
    const { loader, successMessage, errorMessage, userInfo } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Il nome è richiesto.';
        if (!formData.email.trim()) {
            newErrors.email = "L'email è richiesta.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Formato email non valido.';
        }
        if (!formData.password) {
            newErrors.password = 'La password è richiesta.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La password deve avere almeno 6 caratteri.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Le password non corrispondono.';
        }
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'Devi accettare i termini e le condizioni.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            // Se la validazione passa, inviamo i dati.
            dispatch(sellerRegister(formData));
        }
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
    // Questo si attiva quando `userInfo` viene popolato dopo una registrazione riuscita.
    useEffect(() => {
        if (userInfo && userInfo.role === 'seller') {
            navigate('/seller/dashboard');
        }
    }, [userInfo, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 mb-2'>Benvenuto!</h2>
                    <p className='text-gray-600 italic'>Crea il tuo account per iniziare.</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <CustomInput
                        label="Nome"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Inserisci il tuo nome"
                        value={formData.name}
                        onChange={handleChange}
                        errorMessage={errors.name}
                    />
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
                        placeholder="Crea una password"
                        value={formData.password}
                        onChange={handleChange}
                        errorMessage={errors.password}
                    />
                    <CustomInput
                        label="Conferma Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Conferma la password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        errorMessage={errors.confirmPassword}
                    />
                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            id="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                        />
                        <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700">
                            Accetto i <a href="#" className="text-blue-600 hover:underline">termini e condizioni</a>
                        </label>
                        {errors.termsAccepted && (
                            <p className='text-red-500 text-xs ml-2'>{errors.termsAccepted}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        loading={loader}
                        disabled={loader}
                    >
                        {loader ? 'Registrazione in corso...' : 'Registrati'}
                    </Button>
                    <div className="w-full flex justify-center items-center my-3">
                        <div className="w-[45%] h-[1px] bg-slate-700"></div>
                        <p className="px-2 text-gray-600">Oppure</p>
                        <div className="w-[45%] h-[1px] bg-slate-700"></div>
                    </div>
                    <div className="flex justify-center items-center gap-3">
                        <Button variant="google" size='lg'><FaGoogle /></Button>
                        <Button variant="facebook" size='lg'><FaFacebook /></Button>
                    </div>
                </form>
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Hai già un account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Accedi qui</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
