import React, { useState, useEffect, useCallback } from 'react';
import { FiMessageSquare, FiLoader } from 'react-icons/fi';

// Componenti UI specifici
import SellerList from '../../components/chat/SellerList';
import ChatWindow from '../../components/chat/ChatWindow';
import EmptyState from '../../components/chat/EmptyState';
import ChatSkeleton from '../../components/chat/ChatSkeleton';

// Funzioni di utility/dati
import { fetchAllSellers } from '../../data/sellersData';

// Funzione per generare messaggi di esempio (mantenuta per la demo)
const generateDummyMessages = (sellerId) => {
  const dummy = [
    { id: 1, text: "Ciao, come posso aiutarti oggi?", sender: 'admin', timestamp: '10:30' },
    { id: 2, text: "Vorrei un aggiornamento sul mio ultimo ordine.", sender: sellerId, timestamp: '10:31' },
    { id: 3, text: "Certo, potresti fornirmi il numero d'ordine?", sender: 'admin', timestamp: '10:32' },
  ];
  return dummy;
};

const SellerChat = () => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSellers = async () => {
      setLoading(true);
      try {
        const fetchedSellers = await fetchAllSellers();
        const sellersWithStatus = fetchedSellers.map((seller, index) => ({
          ...seller,
          isActive: index % 2 === 0,
        }));

        setSellers(sellersWithStatus);

      } catch (error) {
        console.error("Errore nel caricamento dei venditori:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSellers();
  }, []);

  const handleSellerSelect = useCallback((seller) => {
    setSelectedSeller(seller);
    // Qui caricheresti i messaggi reali da un'API
    setMessages(generateDummyMessages(seller.id));
  }, []);

  const handleSendMessage = useCallback((newMessageText) => {
    if (!selectedSeller) return;

    const newMsg = {
      id: Date.now(),
      text: newMessageText,
      sender: 'admin',
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);

    // Simula una risposta automatica dal venditore
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Messaggio ricevuto, ti risponderò al più presto.",
        sender: selectedSeller.id,
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  }, [selectedSeller]);

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 text-gray-800">
      <SellerList
        sellers={filteredSellers}
        selectedSellerId={selectedSeller?.id}
        onSellerSelect={handleSellerSelect}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="flex-1 flex flex-col">
        {selectedSeller ? (
          <ChatWindow
            seller={selectedSeller}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <EmptyState
            icon={<FiMessageSquare size={48} />}
            title="Nessuna chat selezionata"
            message="Scegli un venditore dalla lista per iniziare a chattare."
          />
        )}
      </main>
    </div>
  );
};

export default SellerChat;