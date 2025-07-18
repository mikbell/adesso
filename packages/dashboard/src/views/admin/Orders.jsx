import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti e Utilità
import { TableHeader, TablePagination, StatusBadge, ActionsMenu, LoadingPage, StandardTable } from '@adesso/ui-components';
import { FiEye, FiTruck, FiXCircle } from 'react-icons/fi';

// Azioni Redux
import { getOrders, updateOrderStatus, clearOrderMessages } from '@adesso/core-logic';

// Hook per il debounce (ottimo per la ricerca)
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};


const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Dati e stato dal Redux Store
    const { orders, totalOrders, loader, successMessage, errorMessage } = useSelector(state => state.order);

    // 2. Stato locale per i filtri e la paginazione
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // 3. Caricamento dati e gestione degli aggiornamenti
    useEffect(() => {
        // Dispatcha l'azione per ottenere gli ordini ogni volta che un filtro cambia
        dispatch(getOrders({
            page: currentPage,
            perPage: itemsPerPage,
            search: debouncedSearchTerm,
            status: statusFilter,
        }));
    }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, successMessage, dispatch]);

    // Gestione delle notifiche (toast)
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearOrderMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearOrderMessages());
        }
    }, [successMessage, errorMessage, dispatch]);

    // 4. Gestori delle azioni che usano Redux
    const handleViewOrder = useCallback((orderId) => navigate(`/admin/dashboard/orders/${orderId}`), [navigate]);

    const handleCancelOrder = useCallback((orderId) => {
        if (window.confirm(`Sei sicuro di voler annullare questo ordine?`)) {
            dispatch(updateOrderStatus({ orderId, status: 'cancelled' }));
        }
    }, [dispatch]);

    // 5. Colonne della tabella
    const columns = useMemo(() => [
        {
            header: 'ID Ordine', render: (item) => (
                <a onClick={() => handleViewOrder(item._id)} className="font-bold text-indigo-600 hover:underline cursor-pointer">
                    {item.orderId}
                </a>
            )
        },
        { header: 'Cliente', accessor: 'customerName' },
        { header: 'Data', render: (item) => new Date(item.createdAt).toLocaleDateString('it-IT') },
        { header: 'Totale', render: (item) => `€${item.totalAmount.toFixed(2)}` },
        { header: 'Stato', render: (item) => <StatusBadge status={item.status} /> },
        {
            header: 'Azioni', render: (item) => (
                <div className="flex justify-end">
                    <ActionsMenu item={item} actionGroups={[
                        { key: 'main', items: [{ label: 'Vedi Dettagli', icon: FiEye, onClick: (o) => handleViewOrder(o._id) }] },
                        { key: 'destructive', items: [{ label: 'Annulla Ordine', icon: FiXCircle, onClick: (o) => handleCancelOrder(o._id), isDestructive: true }] }
                    ]} />
                </div>
            )
        }
    ], [handleViewOrder, handleCancelOrder]);

    // Mostra il caricamento solo se la tabella è completamente vuota
    if (loader && orders.length === 0) {
        return <LoadingPage />;
    }

    return (
        <div className="p-4 md:p-6">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
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
                        className="bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none text-sm"
                    >
                        <option value="all">Tutti gli Stati</option>
                        <option value="pending">In attesa</option>
                        <option value="processing">In preparazione</option>
                        <option value="shipped">Spedito</option>
                        <option value="delivered">Consegnato</option>
                        <option value="cancelled">Annullato</option>
                    </select>
                </TableHeader>

                <StandardTable
                    columns={columns}
                    data={orders}
                    loader={loader}
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalOrders / itemsPerPage)}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalOrders}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </div>
    );
};

export default Orders;