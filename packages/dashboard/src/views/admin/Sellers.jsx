import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti, Utilità e Icone dalla tua libreria UI condivisa
import {
    StandardTable,
    TableHeader,
    TablePagination,
    LoadingPage,
    ActionsMenu,
    CustomListbox,
    StatusBadge
} from '@adesso/ui-components';
import { FiEye, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';

// Azioni Redux dalla tua libreria di logica condivisa
import { fetchUsers, updateSellerStatus, deleteSeller, clearUserMessages } from '@adesso/core-logic';

// --- Opzioni per il Filtro ---
const filterOptions = [
    { id: '', name: 'Tutti i Venditori' },
    { id: 'active', name: 'Venditori Attivi' },
    { id: 'pending', name: 'Richieste in Sospeso' },
    { id: 'deactive,inactive', name: 'Venditori Disattivati' },
];

// --- Mini-Componenti per la UI della Tabella ---
// Spostati fuori dal componente principale per performance e pulizia
const SellerInfo = ({ seller }) => (
    <div className="flex items-center gap-3">
        <img src={seller.avatarUrl} alt={seller.name} className='w-10 h-10 object-cover rounded-full' />
        <span className="font-medium text-gray-800">{seller.name}</span>
    </div>
);

const Sellers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { users: sellers, loader, totalUsers, successMessage, errorMessage } = useSelector(state => state.user);

    // Stato locale per i filtri e la paginazione
    const [statusFilter, setStatusFilter] = useState(filterOptions[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Carica i dati in base ai filtri e si aggiorna dopo un'azione di successo
    useEffect(() => {
        dispatch(fetchUsers({
            role: 'seller',
            status: statusFilter.id,
            page: currentPage,
            perPage,
            search: searchTerm,
        }));
    }, [dispatch, statusFilter, currentPage, perPage, searchTerm, successMessage]);

    // Gestisce le notifiche (toast)
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearUserMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearUserMessages());
        }
    }, [successMessage, errorMessage, dispatch]);

    // --- Colonne della Tabella con Azioni Dinamiche ---
    const columns = useMemo(() => {
        const createActionGroups = (seller) => {
            const actions = {
                view: { label: 'Vedi Dettagli', icon: FiEye, onClick: () => navigate(`/admin/dashboard/sellers/${seller._id}/view`) },
                activate: { label: 'Attiva', icon: FiCheckCircle, onClick: () => dispatch(updateSellerStatus({ sellerId: seller._id, status: 'active' })) },
                deactivate: { label: 'Disattiva', icon: FiXCircle, onClick: () => dispatch(updateSellerStatus({ sellerId: seller._id, status: 'inactive' })), isDestructive: true },
                reject: { label: 'Rifiuta', icon: FiXCircle, onClick: () => dispatch(updateSellerStatus({ sellerId: seller._id, status: 'deactive' })), isDestructive: true },
                delete: { label: 'Elimina Definitivamente', icon: FiTrash2, onClick: () => dispatch(deleteSeller(seller._id)), isDestructive: true },
            };

            const actionGroups = [{ key: 'main', items: [] }];

            switch (seller.status) {
                case 'pending':
                    actionGroups[0].items.push(actions.activate, actions.view);
                    actionGroups.push({ key: 'destructive', items: [actions.reject] });
                    break;
                case 'active':
                    actionGroups[0].items.push(actions.view);
                    actionGroups.push({ key: 'destructive', items: [actions.deactivate, actions.delete] });
                    break;
                case 'inactive':
                case 'deactive':
                    actionGroups[0].items.push(actions.activate, actions.view);
                    actionGroups.push({ key: 'destructive', items: [actions.delete] });
                    break;
                default:
                    actionGroups[0].items.push(actions.view);
            }
            return actionGroups;
        };

        return [
            { header: 'Nome', render: seller => <SellerInfo seller={seller} /> },
            { header: 'Email', accessor: 'email' },
            { header: 'Stato', render: seller => <StatusBadge status={seller.status} /> },
            { header: 'Azioni', render: seller => <ActionsMenu item={seller} actionGroups={createActionGroups(seller)} /> }
        ];
    }, [dispatch, navigate]);

    if (loader && sellers.length === 0) {
        return <LoadingPage />;
    }

    return (
        <div className='px-4 md:px-7 py-5'>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <TableHeader
                    title="Gestione Venditori"
                    showSearch={true}
                    searchTerm={searchTerm}
                    handleSearchChange={(e) => setSearchTerm(e.target.value)}
                >
                    <div className="w-56">
                        <CustomListbox
                            label="Filtra per stato"
                            options={filterOptions}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        />
                    </div>
                </TableHeader>

                <StandardTable
                    data={sellers}
                    columns={columns}
                    loader={loader}
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalUsers / perPage)}
                    itemsPerPage={perPage}
                    totalItems={totalUsers}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(value) => { setPerPage(Number(value)); setCurrentPage(1); }}
                />
            </div>
        </div>
    );
};

export default Sellers;