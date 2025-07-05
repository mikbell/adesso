import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Importa i dati e i componenti riutilizzabili
import { ordersData } from '../../data/ordersData';
import TableHeader from '../../components/tables/TableHeader';
import StandardTable from '../../components/tables/StandardTable';
import TablePagination from '../../components/tables/TablePagination';
import ActionsMenu from '../../components/shared/ActionsMenu';
import StatusBadge from '../../components/shared/StatusBadge';
import { FiEye, FiTruck, FiXCircle } from 'react-icons/fi';

const Orders = () => {
    const navigate = useNavigate();

    // 2. Stato per gestire la tabella (dati, ricerca, paginazione, filtri)
    const [allOrders, setAllOrders] = useState(ordersData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Logica di filtro
    const filteredData = useMemo(() => {
        return allOrders
            .filter(order => statusFilter === 'all' || order.status === statusFilter)
            .filter(order => {
                if (!searchTerm) return true;
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                return (
                    order.id.toLowerCase().includes(lowercasedSearchTerm) ||
                    order.customerName.toLowerCase().includes(lowercasedSearchTerm)
                );
            });
    }, [allOrders, searchTerm, statusFilter]);

    // Logica di paginazione
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Gestori per le azioni
    const handleViewOrder = (order) => navigate(`/admin/dashboard/orders/${order.id.replace('#', '')}`);
    const handleCancelOrder = (order) => {
        if (window.confirm(`Annullare l'ordine ${order.id}? Questa azione non può essere annullata.`)) {
            setAllOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Annullato' } : o));
        }
    };

    // 3. Configurazione delle azioni e delle colonne per gli ordini
    const orderActions = [
        {
            key: 'main',
            items: [
                { label: 'Vedi Dettagli', icon: FiEye, onClick: handleViewOrder },
                { label: 'Traccia Spedizione', icon: FiTruck, onClick: (order) => alert(`Tracciamento per: ${order.id}`) },
            ]
        },
        {
            key: 'destructive',
            items: [
                { label: 'Annulla Ordine', icon: FiXCircle, onClick: handleCancelOrder, isDestructive: true },
            ]
        }
    ];

    const columns = [
        {
            header: 'ID Ordine', render: (item) => (
                <a onClick={() => handleViewOrder(item)} className="font-bold text-indigo-600 hover:underline cursor-pointer">
                    {item.id}
                </a>
            )
        },
        {
            header: 'Cliente', render: (item) => (
                <div>
                    <p className="font-medium text-gray-900">{item.customerName}</p>
                    <p className="text-sm text-gray-500">{item.customerEmail}</p>
                </div>
            )
        },
        { header: 'Data', accessor: 'date' },
        { header: 'Totale', render: (item) => `€${item.total}` },
        { header: 'Stato', render: (item) => <StatusBadge status={item.status} /> },
        {
            header: 'Azioni', render: (item) => (
                <div className="flex justify-end">
                    <ActionsMenu item={item} actionGroups={orderActions} />
                </div>
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
                <TableHeader
                    title="Tutti gli Ordini"
                    showSearch={true}
                    searchTerm={searchTerm}
                    handleSearchChange={(e) => setSearchTerm(e.target.value)}
                >
                    <select
                        name="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg p-2 focus:outline-none text-sm"
                    >
                        <option value="all">Tutti gli Stati</option>
                        <option value="Consegnato">Consegnato</option>
                        <option value="In transito">In transito</option>
                        <option value="In attesa">In attesa</option>
                        <option value="Annullato">Annullato</option>
                    </select>
                </TableHeader>

                <StandardTable
                    columns={columns}
                    data={paginatedData}
                />

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

export default Orders;