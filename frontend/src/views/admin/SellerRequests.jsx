import React, { useState, useEffect, useMemo, useCallback } from 'react';
import StandardTable from '../../components/tables/StandardTable';
import Button from '../../components/shared/Button';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Utility function for status classes (good idea to keep it central)
const getStatusClasses = (statusString) => {
  switch (statusString) {
    case 'Attivo': return 'bg-green-100 text-green-800';
    case 'Inattivo': return 'bg-red-100 text-red-800';
    case 'In attesa': return 'bg-yellow-100 text-yellow-800'; // Primary status for requests
    case 'Rifiutato': return 'bg-gray-100 text-gray-800';
    case 'Confermato': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const SellerRequests = () => {
  const [allSellers, setAllSellers] = useState([]); // This will hold all fetched dummy data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellersData = async () => {
      setLoading(true);

      // Dummy data representing ALL sellers, from which requests will be filtered
      const dummyData = [
        // Active sellers (won't show up as requests)
        { id: 'S001', name: 'Tech Innovations', email: 'tech@example.com', paymentStatus: 'Confermato', status: 'Attivo', productsCount: 150, image: 'https://i.pravatar.cc/300?img=50' },
        { id: 'S002', name: 'Fashion Hub', email: 'fashion@example.com', paymentStatus: 'Confermato', status: 'Attivo', productsCount: 230, image: 'https://i.pravatar.cc/300?img=51' },
        // Sellers in 'In attesa' status (these are the requests)
        { id: 'S003', name: 'Book Nook', email: 'books@example.com', paymentStatus: 'In attesa', status: 'In attesa', productsCount: 0, image: 'https://i.pravatar.cc/300?img=52' },
        { id: 'S004', name: 'Home Essentials', email: 'home@example.com', paymentStatus: 'In attesa', status: 'In attesa', productsCount: 0, image: 'https://i.pravatar.cc/300?img=53' },
        { id: 'S005', name: 'Garden Goods', email: 'garden@example.com', paymentStatus: 'In attesa', status: 'In attesa', productsCount: 0, image: 'https://i.pravatar.cc/300?img=54' },
        // Deactive sellers (might not be considered requests, depends on definition)
        { id: 'S006', name: 'Sport Gear (Deactive)', email: 'sport@example.com', paymentStatus: 'In attesa', status: 'Inattivo', productsCount: 110, image: 'https://i.pravatar.cc/300?img=55' },
        { id: 'S007', name: 'Beauty Zone (Deactive)', email: 'beauty@example.com', paymentStatus: 'Confermato', status: 'Inattivo', productsCount: 95, image: 'https://i.pravatar.cc/300?img=56' },
        // Rejected sellers (won't be requests anymore)
        { id: 'S008', name: 'Game World (Rejected)', email: 'games@example.com', paymentStatus: 'Rifiutato', status: 'Rifiutato', productsCount: 140, image: 'https://i.pravatar.cc/300?img=57' },
      ];
      setAllSellers(dummyData);
      setLoading(false);
    };

    fetchSellersData();
  }, []);

  // Filter for sellers with 'In attesa' status - these are the "requests"
  const sellerRequestsData = useMemo(() => {
    return allSellers.filter(seller => seller.status === 'In attesa');
  }, [allSellers]);

  // --- Action Handlers ---
  const handleAddSeller = useCallback(() => {
    console.log('Open form to add new seller (outside of requests approval)');
    // This might open a different form or modal for general seller creation
  }, []);

  const handleViewDetails = useCallback((sellerId) => {
    navigate(`/admin/dashboard/sellers/${sellerId}/view`);
  }, [navigate]);

  const handleActivateSeller = useCallback((sellerId) => {
    console.log('Attiva venditore:', sellerId);
    setAllSellers(prevSellers =>
      prevSellers.map(seller =>
        seller.id === sellerId ? { ...seller, status: 'Attivo', paymentStatus: 'Confermato' } : seller
      )
    );
    // In a real app, send API request to activate
  }, []);

  const handleRejectSeller = useCallback((sellerId) => {
    console.log('Rifiuta venditore:', sellerId);
    setAllSellers(prevSellers =>
      prevSellers.map(seller =>
        seller.id === sellerId ? { ...seller, status: 'Rifiutato', paymentStatus: 'Rifiutato' } : seller
      )
    );
    // In a real app, send API request to reject
  }, []);

  // For requests page, 'Edit' and 'Delete' might be less common, or only available after approval
  // Or they might mean 'Edit Request' or 'Delete Request'. Adjust logic as per your needs.
  const handleEditSeller = useCallback((sellerId) => {
    console.log('Modifica richiesta venditore (o dati iniziali):', sellerId);
    // This might open a specific form to edit the request details before approval
  }, []);

  const handleDeleteSeller = useCallback((sellerId) => {
    console.log('Elimina richiesta venditore:', sellerId);
    if (window.confirm(`Sei sicuro di voler eliminare la richiesta per il venditore ${sellerId}?`)) {
      setAllSellers(prev => prev.filter(s => s.id !== sellerId));
      // In a real app, send API request to delete the request
    }
  }, []);

  // Define table columns specifically for seller requests
  const sellerRequestsTableColumns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Immagine', render: (seller) => (
        <img src={seller.image} alt={seller.name} className='w-12 h-12 object-cover rounded-full border border-gray-200' onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48/CCCCCC/666666?text=SL" }} />
      )
    },
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Prodotti', accessor: 'productsCount' }, // Maybe always 0 for new requests
    {
      header: 'Stato', render: (seller) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(seller.status)}`}>
          {seller.status}
        </span>
      )
    },
    {
      header: 'Azioni', render: (seller) => (
        <div className="flex justify-end items-center gap-2">
          {/* Main actions for requests: Activate/Reject */}
          <Button onClick={() => handleActivateSeller(seller.id)} variant="success" size="sm" title="Attiva Venditore" icon={FiCheckCircle}>Attiva</Button>
          <Button onClick={() => handleRejectSeller(seller.id)} variant="danger" size="sm" title="Rifiuta Venditore" icon={FiXCircle}>Rifiuta</Button>

          {/* Secondary actions, perhaps for reviewing initial details or cancelling the request */}
          <Button onClick={() => handleViewDetails(seller.id)} variant="ghost" size="sm" title="Visualizza Dettagli" icon={FiEye}></Button>
          <Button onClick={() => handleEditSeller(seller.id)} variant="ghost" size="sm" title="Modifica" icon={FiEdit}></Button>
          <Button onClick={() => handleDeleteSeller(seller.id)} variant="ghost" size="sm" title="Elimina" icon={FiTrash2}></Button>
        </div>
      )
    },
  ], [handleActivateSeller, handleRejectSeller, handleViewDetails, handleEditSeller, handleDeleteSeller]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-700">Caricamento richieste venditori...</div>
    );
  }

  return (
    <div className='px-4 md:px-7 py-5'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Richieste Venditori</h1>
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
        data={sellerRequestsData} // Pass only the filtered requests data
        columns={sellerRequestsTableColumns}
        title=""
        showSearch={true}
        showItemsPerPage={true}
        showViewAllLink={false}
      />
    </div>
  );
};

export default SellerRequests;