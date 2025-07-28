import { FaGoogle, FaFacebook } from "react-icons/fa";

import { register, useAuthForm } from '@adesso/core-logic';

import { AuthForm, CustomInput, CustomButton, CustomCheckbox } from '@adesso/ui-components';


const validateRegister = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'Il nome è richiesto.';
    if (!data.email.trim()) {
        errors.email = "L'email è richiesta.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Formato email non valido.';
    }
    if (!data.password) {
        errors.password = 'La password è richiesta.';
    } else if (data.password.length < 6) {
        errors.password = 'La password deve avere almeno 6 caratteri.';
    }
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Le password non corrispondono.';
    }
    if (!data.termsAccepted) {
        errors.termsAccepted = 'Devi accettare i termini e le condizioni.';
    }
    return errors;
};


const Register = () => {
    const { formData, errors, loader, handleChange, handleSubmit } = useAuthForm({
        initialState: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false,
            userType: 'seller',
        },
        authAction: register,
        validationRules: validateRegister,
        successRedirectPath: '/seller/dashboard',
    });

    return (
        <AuthForm
            title="Benvenuto!"
            subtitle="Crea il tuo account per iniziare."
            handleSubmit={handleSubmit}
            loader={loader}
            submitButtonText="Registrati"
            loadingButtonText="Registrazione in corso..."
            socialLogins={
                <div className="flex justify-center items-center gap-3">
                    <CustomButton variant="google" size='lg'><FaGoogle /></CustomButton>
                    <CustomButton variant="facebook" size='lg'><FaFacebook /></CustomButton>
                </div>
            }
            footerLink={
                <p className="mt-6 text-center text-gray-600 text-sm">
                    Hai già un account?{' '}
                    <CustomButton to="/login" variant="link">Accedi qui</CustomButton>
                </p>
            }
        >
            <CustomInput label="Nome" id="name" name="name" type="text" value={formData.name} onChange={handleChange} errorMessage={errors.name} />
            <CustomInput label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} errorMessage={errors.email} />
            <CustomInput label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} errorMessage={errors.password} />
            <CustomInput label="Conferma Password" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} errorMessage={errors.confirmPassword} />
            <CustomCheckbox
                className="mt-3"
                label="Accetto i termini e le condizioni"
                checked={formData.termsAccepted}
                onChange={(isChecked) => handleChange({ target: { name: 'termsAccepted', value: isChecked } })}
                errorMessage={errors.termsAccepted}
            />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Registrati come:</label>
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

export default Register;