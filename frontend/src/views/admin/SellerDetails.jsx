import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiEdit, FiCheckCircle, FiXCircle, FiDollarSign, FiPackage, FiShoppingCart } from 'react-icons/fi';

// Componenti e Utilità
import CustomButton from '../../components/shared/CustomButton';
import DashboardCard from '../../components/shared/DashboardCard';
import LoadingPage from '../../components/shared/LoadingPage';
import { getStatusClasses } from '../../utils/status';

// Azioni Redux
import { getSellerDetails, updateSellerStatus, clearSellerDetails, clearUserMessages } from '../../store/reducers/userSlice';

// Stati possibili per il venditore (per la dropdown di modifica)
const ALL_SELLER_STATUSES = ['active', 'inactive', 'pending', 'deactive'];

const SellerDetails = () => {
    const { sellerId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Legge i dati e lo stato di caricamento/messaggi dallo store Redux
    const { sellerDetails: seller, loader, successMessage, errorMessage } = useSelector(state => state.user);

    // Stato locale per la UI (es. modifica dello stato)
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    // Effetto per caricare i dati del venditore e pulirli all'uscita dal componente
    useEffect(() => {
        dispatch(getSellerDetails(sellerId));
        return () => {
            dispatch(clearSellerDetails());
        };
    }, [sellerId, dispatch]);

    // Effetto per sincronizzare lo stato locale con i dati da Redux
    useEffect(() => {
        if (seller) {
            setSelectedStatus(seller.status);
        }
    }, [seller]);

    // Effetto per mostrare le notifiche (toast)
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

    // Unica funzione per dispatchare l'aggiornamento dello stato
    const handleUpdateStatus = (status) => {
        if (window.confirm(`Sei sicuro di voler cambiare lo stato di ${seller.name} a "${status}"?`)) {
            dispatch(updateSellerStatus({ sellerId, status }));
            setIsEditingStatus(false);
        }
    };

    // Condizioni di rendering per caricamento ed errori
    if (loader && !seller) {
        return <LoadingPage />;
    }

    if (errorMessage && !seller) {
        return (
            <div className="text-center py-10 text-red-600">
                <p>{errorMessage}</p>
                <CustomButton onClick={() => navigate('/admin/dashboard/sellers')} variant="link">Torna ai Venditori</CustomButton>
            </div>
        );
    }

    if (!seller) {
        return <div className="text-center py-10 text-gray-500">Nessun dato venditore disponibile.</div>;
    }

    return (
        <div className='px-4 md:px-7 py-5'>
            {/* Header pagina */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <CustomButton onClick={() => navigate(-1)} variant="link" className="p-2">
                        <FiArrowLeft size={24} />
                    </CustomButton>
                    <h1 className="text-2xl font-bold text-gray-800">Dettagli: {seller.name}</h1>
                </div>
                <div className="flex gap-3">
                    {seller.status === 'pending' && (
                        <>
                            <CustomButton variant="success" size="md" onClick={() => handleUpdateStatus('active')} icon={FiCheckCircle}>Attiva</CustomButton>
                            <CustomButton variant="danger" size="md" onClick={() => handleUpdateStatus('deactive')} icon={FiXCircle}>Rifiuta</CustomButton>
                        </>
                    )}
                    {(seller.status === 'inactive' || seller.status === 'deactive') && (
                        <CustomButton variant="success" size="md" onClick={() => handleUpdateStatus('active')} icon={FiCheckCircle}>Riattiva</CustomButton>
                    )}
                    {seller.status === 'active' && (
                        <CustomButton variant="danger" size="md" onClick={() => handleUpdateStatus('inactive')} icon={FiXCircle}>Disattiva</CustomButton>
                    )}
                </div>
            </div>

            {/* Sezione Informazioni di Base */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <div className="col-span-1 flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                    <img
                        src={seller.avatarUrl}
                        alt={seller.name}
                        className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-lg mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{seller.name}</h2>
                    {isEditingStatus ? (
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <select
                                className="px-3 py-1 text-sm font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                {ALL_SELLER_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <CustomButton size="sm" variant="success" onClick={() => handleUpdateStatus(selectedStatus)}>Salva</CustomButton>
                                <CustomButton size="sm" variant="secondary" onClick={() => setIsEditingStatus(false)}>Annulla</CustomButton>
                            </div>
                        </div>
                    ) : (
                        <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full cursor-pointer transition-colors duration-200 ${getStatusClasses(seller.status)}`}
                            onClick={() => setIsEditingStatus(true)}
                            title="Clicca per modificare lo stato"
                        >
                            {seller.status}
                        </span>
                    )}
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 bg-white rounded-lg shadow-sm border">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informazioni di Contatto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <p><span className="font-semibold">Email:</span> {seller.email}</p>
                        <p><span className="font-semibold">Telefono:</span> {seller.phone || 'N/D'}</p>
                        <p className="col-span-full"><span className="font-semibold">Indirizzo:</span> {seller.address || 'N/D'}</p>
                        <p><span className="font-semibold">Città:</span> {seller.city || 'N/D'}</p>
                        <p><span className="font-semibold">Regione:</span> {seller.region || 'N/D'}</p>
                        <p><span className="font-semibold">Data Iscrizione:</span> {new Date(seller.createdAt).toLocaleDateString('it-IT')}</p>
                    </div>
                </div>
            </div>

            {/* Sezione Riepilogo Attività */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Riepilogo Attività</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="Ricavi Totali" value={`€${seller.stats?.totalSales?.toFixed(2) || '0.00'}`} icon={<FiDollarSign />} bgColorClass="bg-green-500" />
                <DashboardCard title="Prodotti Caricati" value={seller.stats?.productsListed || 0} icon={<FiPackage />} bgColorClass="bg-purple-500" />
                <DashboardCard title="Ordini Processati" value={seller.stats?.ordersProcessed || 0} icon={<FiShoppingCart />} bgColorClass="bg-blue-500" />
            </div>
        </div>
    );
};

export default SellerDetails;