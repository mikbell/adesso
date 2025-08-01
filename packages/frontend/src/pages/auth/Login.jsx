import React from 'react';
import { Link } from 'react-router-dom';
import { login, useAuthForm } from '@adesso/core-logic';
import { AuthForm, CustomInput, CustomButton } from '@adesso/ui-components';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const validateLogin = (data) => {
  const errors = {};
  if (!data.email.trim()) errors.email = "L'email è richiesta.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Formato email non valido.";
  if (!data.password.trim()) errors.password = "La password è richiesta.";
  return errors;
};

const Login = () => {
  const { formData, errors, loader, handleChange, handleSubmit } = useAuthForm({
    initialState: { email: '', password: '' },
    authAction: (data) => login({ ...data, userType: 'customer' }), // <-- Passa userType
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
      <CustomInput label="Email" name="email" value={formData.email} onChange={handleChange} errorMessage={errors.email} />
      <CustomInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} errorMessage={errors.password} />
    </AuthForm>
  );
};

export default Login;