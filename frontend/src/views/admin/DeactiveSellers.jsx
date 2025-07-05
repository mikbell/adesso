import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardTable from '../../components/StandardTable';
import Button from '../../components/Button';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
// Importa le funzioni e i dati dal file centralizzato
import { fetchAllSellers, getStatusClasses } from '../../data/sellersData'; // Assicurati il percorso corretto

const DeactiveSellers = () => {
  const [allSellers, setAllSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Aggiunto stato per la gestione errori
  const navigate = useNavigate();

  useEffect(() => {
    const loadSellers = async () => {
      setLoading(true);
      setError(null); // Resetta l'errore ad ogni caricamento
      try {
        // Usa la funzione centralizzata per recuperare tutti i venditori
        const data = await fetchAllSellers();
        setAllSellers(data);
      } catch (err) {
        console.error("Errore nel caricamento dei venditori:", err);
        setError("Impossibile caricare i venditori. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    loadSellers();
  }, []);

  // Filtra i venditori per ottenere solo quelli "Inattivo" o "In attesa"
  const DeactiveSellers = useMemo(() => {
    return allSellers.filter(seller => seller.status === 'Inattivo' || seller.status === 'In attesa');
  }, [allSellers]);

  const handleAddSeller = useCallback(() => {
    console.log('Open form to add new seller');
    navigate('/admin/dashboard/sellers/new');
  }, [navigate]);

  const handleViewDetails = useCallback((sellerId) => {
    navigate(`/admin/dashboard/sellers/${sellerId}`);
  }, [navigate]);

  // Funzione per attivare un venditore
  const handleActivateSeller = useCallback((sellerId) => {
    if (window.confirm(`Sei sicuro di voler attivare il venditore ${sellerId}?`)) {
      // In un'applicazione reale, faresti una chiamata API per aggiornare lo stato nel backend.
      // Per ora, aggiorniamo lo stato locale.
      setAllSellers(prevSellers =>
        prevSellers.map(seller =>
          seller.id === sellerId ? { ...seller, status: 'Attivo' } : seller
        )
      );
      console.log(`Venditore ${sellerId} attivato.`);
    }
  }, []);

  // Funzione per rifiutare un venditore (es. da stato 'In attesa' a 'Rifiutato')
  const handleRejectSeller = useCallback((sellerId) => {
    if (window.confirm(`Sei sicuro di voler rifiutare il venditore ${sellerId}?`)) {
      // Chiamata API per aggiornare lo stato nel backend.
      setAllSellers(prevSellers =>
        prevSellers.map(seller =>
          seller.id === sellerId ? { ...seller, status: 'Rifiutato' } : seller
        )
      );
      console.log(`Venditore ${sellerId} rifiutato.`);
    }
  }, []);

  const handleEditSeller = useCallback((sellerId) => {
    console.log('Modifica venditore:', sellerId);
    navigate(`/admin/dashboard/sellers/${sellerId}/edit`);
  }, []);

  const handleDeleteSeller = useCallback((sellerId) => {
    if (window.confirm(`Sei sicuro di voler eliminare il venditore ${sellerId}?`)) {
      // Chiamata API per eliminare il venditore dal backend.
      setAllSellers(prev => prev.filter(s => s.id !== sellerId));
      console.log(`Venditore ${sellerId} eliminato.`);
    }
  }, []);

  const DeactiveSellerTableColumns = useMemo(() => [
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
      header: 'Stato', render: (seller) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(seller.status)}`}>
          {seller.status}
        </span>
      )
    },
    { header: 'Prodotti', accessor: 'productsCount' },
    {
      header: 'Azioni', render: (seller) => (
        <div className="flex justify-end items-center gap-1">
          {/* Pulsanti per stati specifici */}
          {seller.status === 'In attesa' && (
            <>
              <Button onClick={() => handleActivateSeller(seller.id)} variant="success" size="sm" title="Attiva Venditore" icon={FiCheckCircle}>Attiva</Button>
              <Button onClick={() => handleRejectSeller(seller.id)} variant="danger" size="sm" title="Rifiuta Venditore" icon={FiXCircle}>Rifiuta</Button>
            </>
          )}
          {seller.status === 'Inattivo' && (
            <Button onClick={() => handleActivateSeller(seller.id)} variant="success" size="sm" title="Riattiva Venditore" icon={FiCheckCircle}>Riattiva</Button>
          )}
          {/* Azioni sempre disponibili */}
          <Button onClick={() => handleViewDetails(seller.id)} variant="ghost" size="sm" title="Visualizza Dettagli" icon={FiEye}></Button>
          <Button onClick={() => handleEditSeller(seller.id)} variant="ghost" size="sm" title="Modifica" icon={FiEdit}></Button>
          <Button onClick={() => handleDeleteSeller(seller.id)} variant="ghost" size="sm" title="Elimina" icon={FiTrash2}></Button>
        </div>
      )
    },
  ], [handleActivateSeller, handleRejectSeller, handleViewDetails, handleEditSeller, handleDeleteSeller]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-700">Caricamento venditori inattivi...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        {/* Opzionale: un pulsante per riprovare il caricamento */}
        <Button onClick={() => window.location.reload()} className="mt-4">Ricarica Pagina</Button>
      </div>
    );
  }

  return (
    <div className='px-4 md:px-7 py-5'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Venditori Inattivi</h1>
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
        data={DeactiveSellers}
        columns={DeactiveSellerTableColumns}
        title=""
        showSearch={true}
        showItemsPerPage={true}
        showViewAllLink={false}
      />
    </div>
  );
};

export default DeactiveSellers;