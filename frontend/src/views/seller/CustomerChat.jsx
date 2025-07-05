import React, { useState, useEffect, useCallback } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import ChatWindow from '../../components/chat/ChatWindow'; // Riutilizziamo ChatWindow
import CustomerListItem from '../../components/chat/CustomerListItem'; // Usiamo il nuovo componente
import { fetchAllCustomers } from '../../data/customersData'; // Usiamo i dati dei clienti

// Funzione di esempio per i messaggi
const generateDummyMessages = (customerId) => [
  { id: 1, text: `Ciao, sono ${customerId}. Ho un problema con il mio ordine.`, sender: customerId, timestamp: '10:30' },
  { id: 2, text: "Ciao! Sono qui per aiutarti. Qual è il numero dell'ordine?", sender: 'admin', timestamp: '10:31' },
];

const CustomerChat = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedCustomers = await fetchAllCustomers();
      setCustomers(fetchedCustomers);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCustomerSelect = useCallback((customer) => {
    setSelectedCustomer(customer);
    setMessages(generateDummyMessages(customer.id));
  }, []);

  const handleSendMessage = useCallback((text) => {
    // Logica di invio messaggio...
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      <aside className="w-1/3 max-w-sm bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Chat Clienti</h2>
        </div>
        <div className="flex-grow overflow-y-auto">
          {customers.map(customer => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              isSelected={selectedCustomer?.id === customer.id}
              onSelect={handleCustomerSelect}
            />
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        {selectedCustomer ? (
          // In CustomerChat.jsx
          <ChatWindow
            contact={selectedCustomer}
            detailsPath={`/admin/dashboard/customers/${selectedCustomer.id}`}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={'admin'}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiMessageSquare size={48} />
            <h3 className="text-xl mt-4">Seleziona una chat</h3>
          </div>
        )}
      </main>
    </div>
  );
};
export default CustomerChat;