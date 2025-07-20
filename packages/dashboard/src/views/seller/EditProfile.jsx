import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti, Icone e Azioni Redux
import { FiArrowLeft, FiCamera } from 'react-icons/fi';
import {CustomButton, CustomInput, LoadingPage} from '@adesso/ui-components';
import { getUserProfile, updateUserProfile, clearUserMessages } from '@adesso/core-logic';


const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector(state => state.auth);
    const { loader, successMessage, errorMessage } = useSelector(state => state.user);

    const [profileData, setProfileData] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            dispatch(getUserProfile());
        } else {
            setProfileData(userInfo);
        }
    }, [userInfo, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearUserMessages());
            navigate('/seller/dashboard/profile');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearUserMessages());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    const handleChange = (e) => {
        setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData(prev => ({ ...prev, newAvatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        // -> Invia solo i campi effettivamente modificabili e corretti
        formData.append('name', profileData.name);
        formData.append('phone', profileData.phone);
        formData.append('address', profileData.address);
        formData.append('region', profileData.region);
        formData.append('city', profileData.city);
        formData.append('storeName', profileData.storeName);
        formData.append('storeDescription', profileData.storeDescription);

        if (profileData.newAvatar) {
            formData.append('newAvatar', profileData.newAvatar);
        }
        dispatch(updateUserProfile(formData));
    };

    if (loader || !profileData) {
        return <LoadingPage />;
    }

    return (
        <div className="p-4 md:p-6">
            <header className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-2">
                    <FiArrowLeft /><span>Annulla e torna al profilo</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Modifica Profilo</h1>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                {/* Sezione Avatar */}
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img src={avatarPreview || profileData.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                            <FiCamera className="text-gray-600" />
                            <input type="file" id="avatar-upload" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{profileData.name}</h2>
                        <p className="text-gray-500">{profileData.email} (non modificabile)</p>
                    </div>
                </div>
                <hr />
                {/* Sezione Dati Personali e Negozio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* -> Usiamo fallback '|| ""' per prevenire warning di React su input controllati */}
                    <CustomInput label="Nome Completo" name="name" value={profileData.name || ''} onChange={handleChange} />
                    <CustomInput label="Telefono" name="phone" value={profileData.phone || ''} onChange={handleChange} />
                    <CustomInput label="Nome Negozio" name="storeName" value={profileData.storeName || ''} onChange={handleChange} />
                    <CustomInput label="Partita IVA" name="vatNumber" value={profileData.vatNumber || ''} disabled description="Non modificabile" />

                    {/* -> CAMPI CORRETTI */}
                    <CustomInput label="Regione" name="region" value={profileData.region || ''} onChange={handleChange} />
                    <CustomInput label="Città" name="city" value={profileData.city || ''} onChange={handleChange} />

                    <div className="md:col-span-2">
                        <CustomInput as="textarea" label="Indirizzo Completo" name="address" value={profileData.address || ''} onChange={handleChange} rows={3} />
                    </div>
                    <div className="md:col-span-2">
                        <CustomInput as="textarea" label="Descrizione Negozio" name="storeDescription" value={profileData.storeDescription || ''} onChange={handleChange} rows={4} />
                    </div>
                </div>
                {/* Azioni del Form */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <CustomButton type="button" variant="secondary" onClick={() => navigate('/seller/dashboard/profile')}>
                        Annulla
                    </CustomButton>
                    <CustomButton type="submit" loading={loader} disabled={loader}>
                        {loader ? 'Salvataggio in corso...' : 'Salva Modifiche'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;