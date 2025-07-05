import React, { useState, useEffect } from 'react';
import CustomInput from '../../components/shared/CustomInput'; // Assicurati che il percorso sia corretto
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import { sellerRegister, clearMessages } from '../../store/reducers/authReducer';
import { toast } from 'react-hot-toast';

const Register = () => {
    const dispatch = useDispatch();

    const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);

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
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validazione del nome
        if (!formData.name.trim()) { // .trim() per rimuovere spazi bianchi all'inizio/fine
            newErrors.name = 'Il nome è richiesto.';
        }

        // Validazione dell'email
        if (!formData.email.trim()) {
            newErrors.email = "L'email è richiesta.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Formato email non valido.';
        }

        // Validazione della password
        if (!formData.password) {
            newErrors.password = 'La password è richiesta.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La password deve avere almeno 6 caratteri.';
        }

        // Validazione della conferma password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La conferma della password è richiesta.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Le password non corrispondono.';
        }

        // Validazione dei termini e condizioni
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'Devi accettare i termini e le condizioni.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Dati di registrazione:', formData);
            dispatch(sellerRegister(formData));
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                termsAccepted: false,
            });
            setErrors({}); // Resetta anche gli errori
        }
    };

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

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 mb-2'>Benvenuto su Adesso!</h2>
                    <p className='text-gray-600 italic'>Crea il tuo account per iniziare.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <CustomInput
                        label="Nome"
                        id="name"
                        name="name"
                        placeholder="Inserisci il tuo nome"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        errorMessage={errors.name}
                    />

                    <CustomInput
                        label="Email"
                        id="email"
                        name="email"
                        placeholder="Inserisci la tua email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        errorMessage={errors.email}
                    />

                    <CustomInput
                        label="Password"
                        id="password"
                        name="password"
                        placeholder="Crea una password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        errorMessage={errors.password}
                    />

                    <CustomInput
                        label="Conferma Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Conferma la password"
                        type="password"
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

                    <Button disabled={loader ? true : false} type="submit" className='w-full'>
                        {loader ? <PropagateLoader cssOverride={overrideStyle} size={8} color="#fff" /> : 'Registrati'}
                    </Button>

                    <div className="w-full flex justify-center items-center my-3">
                        <div className="w-[45%] h-[1px] bg-slate-700"></div>
                        <p className="px-2 text-gray-600">Oppure</p>
                        <div className="w-[45%] h-[1px] bg-slate-700"></div>
                    </div>

                    <div className="flex justify-center items-center gap-3">
                        <Button variant="google" size='lg'>
                            <FaGoogle />
                        </Button>

                        <Button variant="facebook" size='lg'>
                            <FaFacebook />
                        </Button>
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