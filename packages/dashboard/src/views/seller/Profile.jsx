import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiDollarSign, FiPackage, FiStar, FiSettings, FiEdit, FiUser, FiHome } from 'react-icons/fi';
import CustomButton from '../../components/shared/CustomButton';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import LoadingPage from '../../components/shared/LoadingPage';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../../store/reducers/userSlice';
import { clearUserMessages, updateNotificationSettings } from '../../store/reducers/userSlice';

const StatCard = ({ icon, label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const DetailItem = ({ label, value, fallback = "Non specificato" }) => (
    <p className="text-gray-600 py-1"><span className='font-bold mr-2'>{label}:</span>{value || fallback}</p>
);

const Profile = () => {
    const dispatch = useDispatch();
    const { userInfo: profile, loader: authLoader } = useSelector((state) => state.auth);
    const { loader: userLoader, successMessage, errorMessage } = useSelector((state) => state.user);

    useEffect(() => {
        if (!profile) {
            dispatch(getUserProfile());
        }
    }, [dispatch, profile]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearUserMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearUserMessages());
        }
    }, [successMessage, errorMessage, dispatch]);

    const handleNotificationChange = (setting, value) => {
        dispatch(updateNotificationSettings({ setting, value }));
    };

    if (authLoader || userLoader || !profile) {
        return <LoadingPage />;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- Colonna Principale (Sinistra) --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Profilo */}
                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-center gap-6">
                        <Link to="/seller/dashboard/profile/edit" className="relative group flex-shrink-0">
                            <img src={profile.avatarUrl} alt={profile.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <FiEdit className="text-white" size={24} />
                            </div>
                        </Link>
                        <div className="text-center sm:text-left flex-grow">
                            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                            <p className="text-gray-500">{profile.email}</p>
                            <p className="text-xs text-gray-400 mt-1">Membro dal: {new Date(profile.createdAt).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <CustomButton to="/seller/dashboard/profile/edit" variant="outline">
                                Modifica
                            </CustomButton>
                        </div>
                    </div>

                    {/* Statistiche */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard icon={<FiDollarSign className="text-indigo-600" />} label="Vendite Totali" value={`€${profile.stats?.totalSales?.toFixed(2) || '0.00'}`} />
                        <StatCard icon={<FiPackage className="text-indigo-600" />} label="Prodotti Attivi" value={profile.stats?.productsListed || 0} />
                        <StatCard icon={<FiStar className="text-indigo-600" />} label="Valutazione Media" value={profile.stats?.averageRating || 0} />
                    </div>

                    {/* ▼▼▼ NUOVA CARD: DETTAGLI NEGOZIO ▼▼▼ */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiHome /> Dettagli Negozio</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800">{profile.storeName || 'Nome negozio non impostato'}</h3>
                                <p className="text-sm text-gray-600 mt-1">{profile.storeDescription || 'Nessuna descrizione fornita.'}</p>
                            </div>
                            <DetailItem label="P.IVA" value={profile.vatNumber} />
                        </div>
                    </div>
                </div>

                {/* --- Colonna Laterale (Destra) --- */}
                <div className="space-y-6">
                    {/* Dettagli e Info Contatto */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiUser /> Informazioni Generali</h2>
                        <div className="space-y-1 text-sm">
                            <DetailItem label="Ruolo" value={profile.role} />
                            <DetailItem label="Stato Account" value={profile.status} />
                            <hr className="my-3" />
                            <DetailItem label="Telefono" value={profile.phone} />
                            <DetailItem label="Indirizzo" value={profile.address} />
                            <DetailItem label="Regione" value={profile.region} />
                            <DetailItem label="Città" value={profile.city} />
                        </div>
                    </div>

                    {/* Impostazioni Notifiche */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><FiSettings /> Notifiche</h3>
                        <div className="space-y-4">
                            <ToggleSwitch label="Nuovi ordini" enabled={profile.settings?.notifications?.newOrders} onChange={(value) => handleNotificationChange('newOrders', value)} />
                            <ToggleSwitch label="Nuovi messaggi" enabled={profile.settings?.notifications?.newMessages} onChange={(value) => handleNotificationChange('newMessages', value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;