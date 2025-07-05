import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCamera } from 'react-icons/fi';

// Importa componenti e dati
import { fetchSellerProfile } from '../../data/sellersData';
import Button from '../../components/shared/Button';
import TextInput from '../../components/shared/CustomInput';

const EditProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Carica i dati del profilo al montaggio del componente
    useEffect(() => {
        const loadProfile = async () => {
            const data = await fetchSellerProfile();
            setProfile(data);
            setLoading(false);
        };
        loadProfile();
    }, []);

    // Gestore generico per gli input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // Gestore per la modifica dell'avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(prev => ({ ...prev, newAvatar: file })); // Salva il file per l'upload
            setAvatarPreview(URL.createObjectURL(file)); // Crea l'anteprima
        }
    };

    // Gestore per il salvataggio
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        console.log("Salvataggio dati:", profile);
        // Qui faresti la chiamata API per salvare i dati
        setTimeout(() => {
            setIsSaving(false);
            alert('Profilo aggiornato con successo!');
            navigate('/admin/dashboard/profile');
        }, 1500);
    };

    if (loading) return <div className="p-6 text-center">Caricamento...</div>;

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
                        <img 
                            src={avatarPreview || profile.avatarUrl} 
                            alt="Avatar" 
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                            <FiCamera className="text-gray-600" />
                            <input type="file" id="avatar-upload" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{profile.name}</h2>
                        <p className="text-gray-500">{profile.email} (non modificabile)</p>
                    </div>
                </div>

                <hr />

                {/* Sezione Dati Personali e Negozio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput label="Nome Completo" name="name" value={profile.name} onChange={handleChange} />
                    <TextInput label="Telefono" name="phone" value={profile.phone} onChange={handleChange} />
                    <TextInput label="Nome Negozio" name="storeName" value={profile.storeName} onChange={handleChange} />
                    <TextInput label="Partita IVA" name="vatNumber" value={profile.vatNumber} disabled description="Non modificabile" />
                    
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700">Indirizzo</label>
                        <textarea id="address" name="address" rows="3" value={profile.address} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="storeDescription" className="text-sm font-medium text-gray-700">Descrizione Negozio</label>
                        <textarea id="storeDescription" name="storeDescription" rows="4" value={profile.storeDescription} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                </div>

                {/* Azioni del Form */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/dashboard/profile')}>
                        Annulla
                    </Button>
                    <Button type="submit" loading={isSaving} disabled={isSaving}>
                        {isSaving ? 'Salvataggio in corso...' : 'Salva Modifiche'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;