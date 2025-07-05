import React, { useState } from 'react';
import CustomInput from '../../components/shared/CustomInput';
import { Link } from 'react-router-dom';
import Button from '../../components/shared/Button';
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (loginError) setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = "L'email è richiesta.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Formato email non valido.";
            isValid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = "La password è richiesta.";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            setLoginError('');
            return;
        }

        setIsSubmitting(true);
        setLoginError('');

        try {
            // Simulazione login
            if (formData.email === 'test@example.com' && formData.password === 'password123') {
                alert('Accesso effettuato con successo!');
                console.log('Accesso effettuato', formData);
                setFormData({ email: '', password: '' });
                setErrors({});
            } else {
                setLoginError('Credenziali non valide. Riprova.');
            }
        } catch (error) {
            setLoginError('Errore durante il login. Riprova più tardi.');
            console.error('Errore:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 mb-2'>Bentornato!</h2>
                    <p className='text-gray-600 italic'>Accedi al tuo account.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{loginError}</span>
                        </div>
                    )}

                    <CustomInput
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Inserisci la tua email"
                        value={formData.email}
                        onChange={handleChange}
                        errorMessage={errors.email}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
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
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                    />

                    <div className="text-right mb-6">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Hai dimenticato la password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
                    </Button>

                    <div className="w-full flex justify-center items-center my-5">
                        <div className="w-[45%] h-[1px] bg-gray-300"></div>
                        <p className="px-2 text-gray-600 text-sm">Oppure</p>
                        <div className="w-[45%] h-[1px] bg-gray-300"></div>
                    </div>

                    <div className="flex justify-center items-center gap-3">
                        <Button variant="google" size="lg">
                            <FaGoogle />
                        </Button>
                        <Button variant="facebook" size="lg">
                            <FaFacebook />
                        </Button>
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
