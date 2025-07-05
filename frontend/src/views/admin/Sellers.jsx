import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import Button from '../../components/Button';
import { FiPlus, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
// Importa le funzioni e i dati dal file centralizzato
import { fetchAllSellers, getStatusClasses } from '../../data/sellersData'; // Assicurati il percorso corretto

const Sellers = () => {
    const [allSellers, setAllSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSellers = async () => {
            setLoading(true);
            try {
                const data = await fetchAllSellers();
                setAllSellers(data);
            } catch (error) {
                console.error("Errore nel caricamento dei venditori:", error);
                // Gestisci l'errore, magari impostando uno stato di errore
            } finally {
                setLoading(false);
            }
        };

        loadSellers();
    }, []);

    const handleAddSeller = useCallback(() => {
        console.log('Open form to add new seller');
        // navigate('/admin/dashboard/sellers/new'); // Esempio di navigazione per aggiungere un nuovo venditore
    }, []);

    const handleViewDetails = useCallback((sellerId) => {
        navigate(`/admin/dashboard/sellers/${sellerId}`);
    }, [navigate]);

    const handleEditSeller = useCallback((sellerId) => {
        console.log('Modifica venditore:', sellerId);
        // navigate(`/admin/dashboard/sellers/${sellerId}/edit`); // Esempio di navigazione per modificare un venditore
    }, []);

    const handleDeleteSeller = useCallback((sellerId) => {
        if (window.confirm(`Sei sicuro di voler eliminare il venditore ${sellerId}?`)) {
            // In un'app reale, qui faresti una chiamata API per eliminare il venditore
            console.log('Eliminando venditore:', sellerId);
            setAllSellers(prev => prev.filter(s => s.id !== sellerId));
        }
    }, []);

    const sellerTableColumns = useMemo(() => [
        { header: 'ID', accessor: 'id' },
        {
            header: 'Immagine', render: (seller) => (
                <img src={seller.image} alt={seller.name} className='w-12 h-12 object-cover rounded-full border border-gray-200' onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48/CCCCCC/666666?text=SL" }} />
            )
        },
        { header: 'Nome', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Stato Pagamento', render: (seller) => (
                <>
                    {seller.paymentStatus && (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(seller.paymentStatus)}`}>
                            {seller.paymentStatus}
                        </span>
                    )}
                    {!seller.paymentStatus && (
                        <span className="text-gray-500">N/A</span>
                    )}
                </>
            )
        },
        {
            header: 'Stato Generale', render: (seller) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(seller.status)}`}>
                    {seller.status}
                </span>
            )
        },
        { header: 'Prodotti', accessor: 'productsCount' },
        {
            header: 'Azioni', render: (seller) => (
                <div className="flex justify-end items-center gap-2">
                    <Button onClick={() => handleViewDetails(seller.id)} variant="ghost" size="sm" title="Visualizza Dettagli" icon={FiEye}></Button>
                    <Button onClick={() => handleEditSeller(seller.id)} variant="ghost" size="sm" title="Modifica" icon={FiEdit}></Button>
                    <Button onClick={() => handleDeleteSeller(seller.id)} variant="ghost" size="sm" title="Elimina" icon={FiTrash2}></Button>
                </div>
            )
        },
    ], [handleViewDetails, handleEditSeller, handleDeleteSeller]);

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-700">Caricamento venditori...</div>
        );
    }

    return (
        <div className='px-4 md:px-7 py-5'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tutti i Venditori</h1>
                <Button
                    onClick={handleAddSeller}
                    variant="primary"
                    icon={FiPlus}
                    size="md"
                >
                    Aggiungi Venditore
                </Button>
            </div>

            <StandardTable
                data={allSellers}
                columns={sellerTableColumns}
                title=""
                showSearch={true}
                showItemsPerPage={true}
                showViewAllLink={false}
            />
        </div>
    );
};

export default Sellers;