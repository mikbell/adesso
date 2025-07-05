import React, { useState } from 'react';
import CustomInput from '../../components/shared/CustomInput';
import Button from '../../components/shared/Button';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, clearMessages } from '../../store/reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { overrideStyle } from '../../utils/utils';

const AdminLogin = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(adminLogin(formData));
        const newErrors = {};
        let formIsValid = true;

        if (!formData.email.trim()) {
            newErrors.email = "L'email è richiesta.";
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Formato email non valido.";
            formIsValid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = "La password è richiesta.";
            formIsValid = false;
        }

        setErrors(newErrors);

        if (!formIsValid) {
            return;
        }

        try {

            if (formData.email === 'test@example.com' && formData.password === 'password123') {
                console.log('Accesso effettuato con successo!', formData);
                alert('Accesso effettuato con successo!');
                setFormData({ email: '', password: '' });
                setErrors({});
            }
        } catch (error) {
            console.error('Errore durante il login:', error);
        }
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearMessages());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearMessages());
            navigate('/');
        }
    }, [errorMessage, successMessage, dispatch, navigate]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center p-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 mb-2'>Adesso.it</h2>
                    <p className='text-gray-600 italic'>Admin Login</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <CustomInput
                        label="Email"
                        id="email"
                        name="email"
                        placeholder="Inserisci la tua email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <CustomInput
                        label="Password"
                        id="password"
                        name="password"
                        placeholder="Inserisci la tua password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Button disabled={loader ? true : false} type="submit" className='w-full'>
                        {loader ? <PropagateLoader cssOverride={overrideStyle} size={8} color="#fff" /> : 'Accedi'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;