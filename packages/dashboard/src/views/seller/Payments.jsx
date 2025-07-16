import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaUniversity } from 'react-icons/fa';

// Importa i componenti riutilizzabili
import TableHeader from '../../components/tables/TableHeader';
import StandardTable from '../../components/tables/StandardTable';
import TablePagination from '../../components/tables/TablePagination';
import ActionsMenu from '../../components/shared/ActionsMenu';
import StatusBadge from '../../components/shared/StatusBadge';

// Importa dati e icone
import { paymentsData } from '../../data/paymentsData';
import { FiEye, FiRefreshCw } from 'react-icons/fi';

// Mappa per le icone dei metodi di pagamento
const paymentMethodIcons = {
    visa: <FaCcVisa className="text-2xl text-blue-700" />,
    mastercard: <FaCcMastercard className="text-2xl text-red-600" />,
    paypal: <FaPaypal className="text-2xl text-blue-800" />,
    bonifico: <FaUniversity className="text-xl text-gray-500" />,
};

const Payments = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState(paymentsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'all', method: 'all' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Logica di filtro
    const filteredData = useMemo(() => {
        return payments
            .filter(p => filters.status === 'all' || p.status === filters.status)
            .filter(p => filters.method === 'all' || p.method === filters.method)
            .filter(p => {
                if (!searchTerm) return true;
                const lower = searchTerm.toLowerCase();
                return p.transactionId.toLowerCase().includes(lower) ||
                    p.orderId.toLowerCase().includes(lower) ||
                    p.customerName.toLowerCase().includes(lower);
            });
    }, [payments, searchTerm, filters]);

    // Logica di paginazione
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Gestori per le azioni
    const handleViewOrder = (payment) => navigate(`/admin/dashboard/orders/${payment.orderId.replace('#', '')}`);
    const handleRefund = (payment) => {
        if (payment.status === 'Rimborsato') {
            alert('Questo pagamento è già stato rimborsato.');
            return;
        }
        if (window.confirm(`Emettere un rimborso completo per la transazione ${payment.transactionId}?`)) {
            setPayments(prev => prev.map(p => p.transactionId === payment.transactionId ? { ...p, status: 'Rimborsato' } : p));
        }
    };

    // Configurazione delle azioni per il menu
    const paymentActions = [
        {
            key: 'main',
            items: [
                { label: 'Vedi Ordine', icon: FiEye, onClick: handleViewOrder },
                { label: 'Emetti Rimborso', icon: FiRefreshCw, onClick: handleRefund, isDestructive: true },
            ]
        }
    ];

    // Configurazione delle colonne
    const columns = [
        { header: 'ID Transazione', accessor: 'transactionId', render: item => <span className="font-mono text-xs">{item.transactionId}</span> },
        { header: 'Ordine', render: item => <a onClick={() => handleViewOrder(item)} className="font-bold text-indigo-600 hover:underline cursor-pointer">{item.orderId}</a> },
        { header: 'Data', render: item => new Date(item.date).toLocaleDateString('it-IT') },
        { header: 'Cliente', accessor: 'customerName' },
        {
            header: 'Metodo', render: item => (
                <div className="flex items-center gap-2">
                    {paymentMethodIcons[item.method]}
                    <span className="capitalize">{item.method}</span>
                </div>
            )
        },
        { header: 'Importo', render: item => <span className="font-semibold">€{item.amount}</span> },
        { header: 'Stato', render: item => <StatusBadge status={item.status} /> },
        {
            header: 'Azioni', render: item => (
                <div className="flex justify-end"><ActionsMenu item={item} actionGroups={paymentActions} /></div>
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
                <TableHeader
                    title="Transazioni Pagamenti"
                    showSearch={true}
                    searchTerm={searchTerm}
                    handleSearchChange={(e) => setSearchTerm(e.target.value)}
                >
                    {/* Filtri personalizzati per questa pagina */}
                    <select
                        name="method"
                        onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
                        className="bg-white border border-gray-300 rounded-lg p-2 focus:outline-none text-sm"
                    >
                        <option value="all">Tutti i Metodi</option>
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="paypal">Paypal</option>
                        <option value="bonifico">Bonifico</option>
                    </select>
                    <select
                        name="status"
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="bg-white border border-gray-300 rounded-lg p-2 focus:outline-none text-sm"
                    >
                        <option value="all">Tutti gli Stati</option>
                        <option value="Completato">Completato</option>
                        <option value="In sospeso">In sospeso</option>
                        <option value="Fallito">Fallito</option>
                        <option value="Rimborsato">Rimborsato</option>
                    </select>
                </TableHeader>

                <StandardTable columns={columns} data={paginatedData} />

                {totalPages > 1 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Payments;