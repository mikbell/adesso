import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMessageSquare } from 'react-icons/fi';

// Componenti e Azioni
import { SellerList, ChatWindow, EmptyState, ChatSkeleton } from '@adesso/ui-components';
import { getSellersForChat, getMessages, sendMessage } from '@adesso/core-logic';

const SellerChat = () => {
  const dispatch = useDispatch();

  // Legge i dati dallo stato di Redux
  const { userInfo: adminInfo } = useSelector(state => state.auth);
  const { sellers, messages, loader } = useSelector(state => state.chat);

  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Carica la lista dei venditori al montaggio
  useEffect(() => {
    dispatch(getSellersForChat());
  }, [dispatch]);

  // Carica i messaggi quando viene selezionato un venditore
  const handleSellerSelect = useCallback((seller) => {
    setSelectedSeller(seller);
    dispatch(getMessages(seller._id));
  }, [dispatch]);

  // Invia un nuovo messaggio
  const handleSendMessage = useCallback((messageText) => {
    if (!selectedSeller) return;
    dispatch(sendMessage({
      sellerId: selectedSeller._id,
      message: messageText,
    }));
  }, [dispatch, selectedSeller]);

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loader) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] bg-gray-50 text-gray-800 rounded-lg shadow-md overflow-hidden">
      <SellerList
        sellers={filteredSellers}
        selectedSellerId={selectedSeller?._id}
        onSellerSelect={handleSellerSelect}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="flex-1 flex flex-col">
        {selectedSeller ? (
          <ChatWindow
            contact={selectedSeller}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={adminInfo._id} // Passa l'ID dell'admin per distinguere i messaggi
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