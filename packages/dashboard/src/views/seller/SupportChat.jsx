import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiMessageSquare } from 'react-icons/fi';

// Componenti e Azioni
import { CustomerList, ChatWindow, EmptyState, ChatSkeleton } from '@adesso/ui-components';
import { getCustomersForSeller, getMessages, sellerSendMessage } from '@adesso/core-logic';

const SupportChat = () => {
  const dispatch = useDispatch();

  // Legge i dati dallo stato di Redux
  const { userInfo: sellerInfo } = useSelector(state => state.auth);
  const { sellers: customers, messages, loader } = useSelector(state => state.chat);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Carica la lista dei clienti al montaggio
  useEffect(() => {
    dispatch(getCustomersForSeller());
  }, [dispatch]);

  // Carica i messaggi quando viene selezionato un cliente
  const handleCustomerSelect = useCallback((customer) => {
    setSelectedCustomer(customer);
    // Qui dovresti avere un thunk getMessages che prende l'ID del cliente
    // e l'ID del venditore (dal tuo userInfo) per caricare la conversazione
    dispatch(getMessages(customer._id));
  }, [dispatch]);

  // Invia un nuovo messaggio
  const handleSendMessage = useCallback((messageText) => {
    if (!selectedCustomer) return;
    dispatch(sellerSendMessage({
      customerId: selectedCustomer._id,
      message: messageText,
    }));
  }, [dispatch, selectedCustomer]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loader) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white text-gray-800 rounded-lg shadow-md overflow-hidden border">
      <aside className="w-1/3 max-w-sm border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Le Tue Chat</h2>
          {/* Potresti aggiungere qui una barra di ricerca */}
        </div>
        <div className="flex-grow overflow-y-auto">
          {filteredCustomers.map(customer => (
            <CustomerListItem
              key={customer._id}
              customer={customer}
              isSelected={selectedCustomer?._id === customer._id}
              onSelect={() => handleCustomerSelect(customer)}
            />
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <ChatWindow
            contact={selectedCustomer}
            detailsPath={`/seller/dashboard/orders?customerId=${selectedCustomer._id}`} // Esempio
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={sellerInfo._id} // Passa l'ID del venditore
          />
        ) : (
          <EmptyState
            icon={<FiMessageSquare size={48} />}
            title="Nessuna chat selezionata"
            message="Scegli un cliente dalla lista per vedere la conversazione."
          />
        )}
      </main>
    </div>
  );
};

export default SupportChat;