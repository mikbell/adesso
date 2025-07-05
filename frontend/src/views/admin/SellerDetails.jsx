import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiCheckCircle, FiXCircle, FiDollarSign, FiPackage, FiShoppingCart } from 'react-icons/fi';
import Button from '../../components/Button';
import DashboardCard from '../../components/DashboardCard';
import { fetchSellerDetails, getStatusClasses } from '../../data/sellersData';

// Definisci qui l'elenco di tutti gli stati possibili per un venditore
// In un'applicazione reale, questi potrebbero provenire da un'API o da un file di configurazione
const ALL_SELLER_STATUSES = ['Attivo', 'Inattivo', 'In attesa', 'Rifiutato'];

const SellerDetails = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingStatus, setIsEditingStatus] = useState(false); // Nuovo stato per la modalità di modifica
    const [selectedStatus, setSelectedStatus] = useState(''); // Stato per il valore selezionato nel select

    useEffect(() => {
        const loadSellerDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const foundSeller = await fetchSellerDetails(id);
                if (foundSeller) {
                    setSeller(foundSeller);
                    setSelectedStatus(foundSeller.status); // Inizializza con lo stato attuale
                } else {
                    setError('Venditore non trovato.');
                }
            } catch (err) {
                setError('Errore durante il caricamento dei dettagli del venditore.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadSellerDetails();
    }, [id]);

    // Funzione per gestire il cambiamento di stato dal select
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    // Funzione per salvare il nuovo stato
    const handleSaveStatus = () => {
        if (window.confirm(`Sei sicuro di voler cambiare lo stato di ${seller.name} a "${selectedStatus}"?`)) {
            // In un'applicazione reale, qui faresti una chiamata API per aggiornare lo stato nel backend.
            console.log(`Aggiornando stato di ${seller.name} a: ${selectedStatus}`);
            setSeller(prev => ({ ...prev, status: selectedStatus })); // Aggiorna lo stato locale
            setIsEditingStatus(false); // Esci dalla modalità di modifica
            // Esempio API call: api.updateSellerStatus(seller.id, selectedStatus);
        }
    };

    // Funzione per annullare la modifica dello stato
    const handleCancelStatusEdit = () => {
        setSelectedStatus(seller.status); // Ripristina lo stato originale
        setIsEditingStatus(false); // Esci dalla modalità di modifica
    };

    const handleActivate = () => {
        if (window.confirm(`Sei sicuro di voler attivare ${seller.name}?`)) {
            console.log(`Attivando ${seller.name}...`);
            setSeller(prev => ({ ...prev, status: 'Attivo' }));
            setSelectedStatus('Attivo'); // Aggiorna anche il select
            // api.activateSeller(seller.id);
        }
    };

    const handleReject = () => {
        if (window.confirm(`Sei sicuro di voler rifiutare ${seller.name}?`)) {
            console.log(`Rifiutando ${seller.name}...`);
            setSeller(prev => ({ ...prev, status: 'Rifiutato' }));
            setSelectedStatus('Rifiutato'); // Aggiorna anche il select
            // api.rejectSeller(seller.id);
        }
    };

    const handleEdit = () => {
        console.log(`Modifica venditore ${seller.name}`);
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-700">Caricamento dettagli venditore...</div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-600">
                <p>{error}</p>
                <Link to="/admin/dashboard/sellers" className="text-indigo-600 hover:underline mt-4 block">Torna ai Venditori</Link>
            </div>
        );
    }

    if (!seller) {
        return <div className="text-center py-10 text-gray-500">Nessun dato venditore disponibile.</div>;
    }

    return (
        <div className='px-4 md:px-7 py-5'>
            {/* Header della pagina e navigazione */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard/sellers" className="text-gray-500 hover:text-gray-800 transition-colors">
                        <FiArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Dettagli Venditore: {seller.name}</h1>
                </div>
                <div className="flex gap-3">
                    {seller.status === 'In attesa' && (
                        <>
                            <Button variant="success" size="md" onClick={handleActivate} icon={FiCheckCircle}>Attiva</Button>
                            <Button variant="danger" size="md" onClick={handleReject} icon={FiXCircle}>Rifiuta</Button>
                        </>
                    )}
                    {(seller.status === 'Inattivo' || seller.status === 'Rifiutato') && (
                        <Button variant="success" size="md" onClick={handleActivate} icon={FiCheckCircle}>Riattiva</Button>
                    )}
                    {seller.status === 'Attivo' && (
                        <Button variant="danger" size="md" onClick={handleReject} icon={FiXCircle}>Disattiva</Button>
                    )}
                    <Button variant="secondary" size="md" onClick={handleEdit} icon={FiEdit}>Modifica</Button>
                </div>
            </div>

            {/* Sezione Informazioni di Base e Dettagli Contatto */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {/* Immagine Profilo e Stato */}
                <div className="col-span-1 flex flex-col items-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <img
                        src={seller.image}
                        alt={seller.name}
                        className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-lg mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{seller.name}</h2>
                    {/* Logica per il cambio di stato al click */}
                    {isEditingStatus ? (
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <select
                                className="px-3 py-1 text-sm font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                            >
                                {ALL_SELLER_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <Button size="sm" variant="success" onClick={handleSaveStatus} icon={FiCheckCircle}>Salva</Button>
                                <Button size="sm" variant="secondary" onClick={handleCancelStatusEdit} icon={FiXCircle}>Annulla</Button>
                            </div>
                        </div>
                    ) : (
                        <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full cursor-pointer transition-colors duration-200 ${getStatusClasses(seller.status)}`}
                            onClick={() => setIsEditingStatus(true)} // Abilita la modalità di modifica al click
                            title="Clicca per modificare lo stato"
                        >
                            Stato: {seller.status}
                        </span>
                    )}

                    {seller.paymentStatus && (
                        <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(seller.paymentStatus)}`}>
                            Pagamento: {seller.paymentStatus}
                        </span>
                    )}
                </div>

                {/* Dettagli Contatto */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informazioni di Contatto e Indirizzo</h3>
                    <div className="space-y-3 text-gray-700">
                        <p><span className="font-semibold">Nome:</span> {seller.name}</p>
                        <p><span className="font-semibold">Ruolo:</span> {seller.role}</p>
                        <p><span className="font-semibold">Email:</span> {seller.email}</p>
                        <p><span className="font-semibold">Telefono:</span> {seller.phone || 'N/A'}</p>
                        <p><span className="font-semibold">Data di Iscrizione:</span> {seller.joinDate}</p>
                        <p>
                            <span className="font-semibold">Indirizzo:</span>{' '}
                            {seller.address || 'N/A'}
                            {seller.district && ` - ${seller.district}`}
                            {seller.division && ` (${seller.division})`}
                            {seller.state && ` - ${seller.state}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sezione Riepilogo Attività */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Riepilogo Attività</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard
                    title="Ricavi Totali"
                    value={seller.totalRevenue}
                    icon={<FiDollarSign />}
                    bgColorClass="bg-green-500"
                />
                <DashboardCard
                    title="Prodotti Caricati"
                    value={seller.productsCount}
                    icon={<FiPackage />}
                    bgColorClass="bg-purple-500"
                />
                <DashboardCard
                    title="Ordini Processati"
                    value={seller.ordersProcessed}
                    icon={<FiShoppingCart />}
                    bgColorClass="bg-blue-500"
                />
            </div>

            {/* Sezione Ordini Recenti (TODO: implementare una tabella qui o link) */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Ordini Recenti</h3>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 min-h-[150px] flex items-center justify-center text-gray-500">
                <p>Lista ordini recenti del venditore o link a tutti gli ordini</p>
            </div>

            {/* Sezione Prodotti del Venditore (TODO: implementare una tabella qui o link) */}
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2">Prodotti del Venditore</h3>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 min-h-[150px] flex items-center justify-center text-gray-500">
                <p>Lista prodotti del venditore o link a tutti i prodotti</p>
            </div>
        </div>
    );
};

export default SellerDetails;