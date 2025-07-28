import { Link } from 'react-router-dom';
import { login, useAuthForm } from '@adesso/core-logic';
import { AuthForm, CustomInput, CustomButton } from '@adesso/ui-components';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const validateLogin = (data) => {
    const errors = {};
    if (!data.email.trim()) errors.email = "L'email è richiesta.";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Formato email non valido.";
    if (!data.password.trim()) errors.password = "La password è richiesta.";
    // Aggiungi una validazione per il userType se necessario
    if (!data.userType) errors.userType = "Il tipo di utente è richiesto.";
    return errors;
};

const Login = () => {
    const { formData, errors, loader, handleChange, handleSubmit } = useAuthForm({
        // Aggiungi userType allo stato iniziale, con un valore predefinito
        initialState: { email: '', password: '', userType: 'seller' },
        authAction: login,
        validationRules: validateLogin,
        successRedirectPath: '/',
    });

    return (
        <AuthForm
            title="Accedi"
            subtitle="Inserisci le tue credenziali per continuare"
            handleSubmit={handleSubmit}
            loader={loader}
            submitButtonText="Accedi"
            loadingButtonText="Accesso in corso..."
            socialLogins={
                <div className="flex justify-center items-center gap-3">
                    <CustomButton variant="google" size='lg'><FaGoogle /></CustomButton>
                    <CustomButton variant="facebook" size='lg'><FaFacebook /></CustomButton>
                </div>
            }
            footerLink={
                <p className="mt-6 text-center text-sm text-gray-600">
                    Non hai un account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">Registrati qui</Link>
                </p>
            }
        >
            <CustomInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                errorMessage={errors.email}
            />
            <CustomInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                errorMessage={errors.password}
            />

            {/* Aggiungi un selettore per il ruolo */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Accedi come:</label>
                <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="seller">Venditore</option>
                    <option value="admin">Amministratore</option>
                </select>
                {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
            </div>
        </AuthForm>
    );
};

export default Login;