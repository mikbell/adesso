import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StandardTable from '../../components/tables/StandardTable';
import TableHeader from '../../components/tables/TableHeader';
import TablePagination from '../../components/tables/TablePagination';
import StatusBadge from '../../components/shared/StatusBadge';
import ActionsMenu from '../../components/shared/ActionsMenu';
import LoadingPage from '../../components/shared/LoadingPage';
import { FiEye, FiTruck, FiXCircle } from 'react-icons/fi';
import { getOrders, updateOrderStatus, clearOrderMessages } from '../../store/reducers/orderSlice';

// Funzione per il debounce
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
    const { orders, totalOrders, loader, successMessage, errorMessage } = useSelector(state => state.order);

    // Stato locale per i controlli della UI
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Carica i dati e si aggiorna dopo un'azione di successo
    useEffect(() => {
        dispatch(getOrders({
            page: currentPage,
            perPage: itemsPerPage,
            search: debouncedSearchTerm,
            status: statusFilter
        }));
    }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, successMessage, dispatch]);

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

    const handleCancelOrder = useCallback((orderId) => {
        if (window.confirm(`Annullare l'ordine?`)) {
            dispatch(updateOrderStatus({ orderId, status: 'cancelled' }));
        }
    }, [dispatch]);

    const columns = useMemo(() => [
        { header: 'ID Ordine', accessor: 'orderId' },
        { header: 'Cliente', accessor: 'customerName' },
        { header: 'Data', render: (item) => new Date(item.createdAt).toLocaleDateString('it-IT') },
        { header: 'Totale', render: (item) => `€${item.totalAmount.toFixed(2)}` },
        { header: 'Stato', render: (item) => <StatusBadge status={item.status} /> },
        {
            header: 'Azioni', render: (item) => (
                <div className="flex justify-end">
                    <ActionsMenu item={item} actionGroups={[
                        { key: 'main', items: [{ label: 'Vedi Dettagli', icon: FiEye, onClick: (o) => navigate(`/admin/dashboard/orders/${o._id}`) }] },
                        { key: 'destructive', items: [{ label: 'Annulla Ordine', icon: FiXCircle, onClick: (o) => handleCancelOrder(o._id), isDestructive: true }] }
                    ]} />
                </div>
            )
        }
    ], [navigate, handleCancelOrder]);

    if (loader && orders.length === 0) {
        return <LoadingPage />;
    }

    return (
        <div className="p-4 md:p-6">
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
                <TableHeader title="Gestione Ordini" showSearch={true} searchTerm={searchTerm} handleSearchChange={(e) => setSearchTerm(e.target.value)}>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-gray-300 rounded-lg p-2 focus:outline-none text-sm">
                        <option value="all">Tutti gli Stati</option>
                        <option value="pending">In attesa</option>
                        <option value="processing">In preparazione</option>
                        <option value="shipped">Spedito</option>
                        <option value="delivered">Consegnato</option>
                        <option value="cancelled">Annullato</option>
                    </select>
                </TableHeader>

                <StandardTable columns={columns} data={orders} loader={loader} />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalOrders / itemsPerPage)}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                />
            </div>
        </div>
    );
};

export default Orders;