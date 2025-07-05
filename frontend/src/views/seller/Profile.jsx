import React, { useState, useEffect } from 'react';
import { FiEdit, FiDollarSign, FiPackage, FiStar, FiUser, FiHome, FiSettings, FiBell } from 'react-icons/fi';
import Button from '../../components/shared/Button';
import { fetchSellerProfile } from '../../data/sellersData';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            const data = await fetchSellerProfile();
            setProfile(data);
            setLoading(false);
        };
        loadProfile();
    }, []);

    if (loading || !profile) {
        return <div className="p-6 text-center">Caricamento del profilo...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Colonna Principale (Sinistra) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Profilo */}
                    <div className="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group flex-shrink-0">
                            <img src={profile.avatarUrl} alt={profile.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <FiEdit className="text-white" size={24} />
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                            <p className="text-gray-500">{profile.email}</p>
                            <p className="text-xs text-gray-400 mt-1">Membro dal: {new Date(profile.memberSince).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="sm:ml-auto">
                            <Button to="/seller/dashboard/profile/edit" variant="outline">
                                Modifica Profilo
                            </Button>
                        </div>
                    </div>

                    {/* Statistiche */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard icon={<FiDollarSign className="text-indigo-600" />} label="Vendite Totali" value={`€${profile.stats.totalSales}`} />
                        <StatCard icon={<FiPackage className="text-indigo-600" />} label="Prodotti Attivi" value={profile.stats.productsListed} />
                        <StatCard icon={<FiStar className="text-indigo-600" />} label="Valutazione Media" value={profile.stats.averageRating} />
                    </div>

                    {/* Dettagli Profilo */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiUser /> Dettagli Profilo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            <p className="text-gray-600"><span className='font-bold mr-2'>Ruolo:</span>{profile.role}</p>
                            <p className="text-gray-600"><span className='font-bold mr-2'>Stato:</span>{profile.status}</p>
                            <p className="text-gray-600"><span className='font-bold mr-2'>Regione:</span>{profile.division}</p>
                            <p className="text-gray-600"><span className='font-bold mr-2'>Città:</span>{profile.district}</p>
                            <p className="text-gray-600"><span className='font-bold mr-2'>Nazione:</span>{profile.state}</p>
                        </div>
                    </div>

                    {/* Dettagli Negozio */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiHome /> Dettagli Negozio</h2>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{profile.storeName}</h3>
                            <p className="text-gray-600">{profile.storeDescription}</p>
                            <p className="text-sm text-gray-500">P.IVA: {profile.vatNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Colonna Laterale (Destra) */}
                <div className="space-y-6">
                    {/* Info Contatto */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiUser /> Informazioni di Contatto</h2>
                        <div className="space-y-2 text-gray-600">
                            <p><strong>Telefono:</strong> {profile.phone}</p>
                            <p><strong>Indirizzo:</strong></p>
                            <p className="whitespace-pre-line">{profile.address}</p>
                        </div>
                    </div>

                    {/* Impostazioni Account */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <Link to="/seller/dashboard/settings" className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiSettings /> Impostazioni</Link>
                        <div className="space-y-4">
                            <div className="border p-4 rounded-lg space-y-2">
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><FiBell /> Notifiche</h3>
                                <ToggleSwitch label="Nuovi ordini" enabled={profile.settings.notifications.newOrders} />
                                <ToggleSwitch label="Nuovi messaggi" enabled={profile.settings.notifications.newMessages} />
                            </div>
                            <Button variant="secondary" className="w-full">Cambia Password</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;