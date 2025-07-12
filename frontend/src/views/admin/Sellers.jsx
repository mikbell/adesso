import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti, Utilità e Icone
import StandardTable from '../../components/tables/StandardTable';
import TableHeader from '../../components/tables/TableHeader';
import TablePagination from '../../components/tables/TablePagination';
import LoadingPage from '../../components/shared/LoadingPage';
import ActionsMenu from '../../components/shared/ActionsMenu';
import CustomListbox from '../../components/shared/CustomListbox'; // -> Importiamo il nuovo componente
import { FiEye, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { getStatusClasses } from '../../utils/status';

// Azioni Redux
import { fetchUsers, updateSellerStatus, deleteSeller, clearUserMessages } from '../../store/reducers/userSlice';


// -> 1. Definiamo le opzioni per il nostro filtro
const filterOptions = [
    { id: '', name: 'Tutti i Venditori' }, // id '' per non passare filtri di stato
    { id: 'active', name: 'Venditori Attivi' },
    { id: 'pending', name: 'Richieste in Sospeso' },
    { id: 'inactive,deactive', name: 'Venditori Disattivati' },
];


const Sellers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { users: sellers, loader, totalUsers, successMessage } = useSelector(state => state.user);

    // -> 2. Stato per i filtri e la paginazione
    const [statusFilter, setStatusFilter] = useState(filterOptions[0]); // Lo stato ora è un oggetto
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // --- Logica Unificata ---
    useEffect(() => {
        // -> 3. Il fetch usa il valore del filtro selezionato
        dispatch(fetchUsers({
            role: 'seller',
            status: statusFilter.id, // Passa l'id del filtro (es. 'pending', 'active', etc.)
            page: currentPage,
            perPage,
            search: searchTerm,
        }));
    }, [dispatch, statusFilter, currentPage, perPage, searchTerm, successMessage]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearUserMessages());
        }
    }, [successMessage, dispatch]);

    // --- Colonne con Azioni Dinamiche ---
    const columns = useMemo(() => {
        // Funzioni helper per creare i gruppi di azioni
        const createActionGroups = (seller) => {
            const actions = {
                view: { label: 'Vedi Dettagli', icon: FiEye, onClick: () => navigate(`/admin/dashboard/sellers/${seller._id}/view`) },
                activate: { label: 'Attiva', icon: FiCheckCircle, onClick: () => dispatch(updateSellerStatus({ sellerId: seller._id, status: 'active' })) },
                deactivate: { label: 'Disattiva', icon: FiXCircle, onClick: () => dispatch(updateSellerStatus({ sellerId: seller._id, status: 'inactive' })), isDestructive: true },
                reject: { label: 'Rifiuta', icon: FiXCircle, onClick: () => dispatch(updateSellerStatus({ sellerId: seller._id, status: 'deactive' })), isDestructive: true },
                delete: { label: 'Elimina', icon: FiTrash2, onClick: () => dispatch(deleteSeller(seller._id)), isDestructive: true },
            };

            const actionGroups = [{ key: 'main', items: [actions.view] }];

            if (seller.status === 'pending') {
                actionGroups[0].items.unshift(actions.activate); // Aggiunge "Attiva" all'inizio
                actionGroups.push({ key: 'destructive', items: [actions.reject] });
            } else if (seller.status === 'active') {
                actionGroups.push({ key: 'destructive', items: [actions.deactivate] });
            } else if (['inactive', 'deactive'].includes(seller.status)) {
                actionGroups[0].items.unshift(actions.activate);
            }

            // Aggiunge l'opzione di eliminazione per tutti tranne quelli in attesa
            if (seller.status !== 'pending') {
                actionGroups.push({ key: 'permanent_delete', items: [actions.delete] });
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
            <TableHeader
                title="Gestione Venditori"
                showSearch={true}
                searchTerm={searchTerm}
                handleSearchChange={(e) => setSearchTerm(e.target.value)}
            >
                <div className="w-56">
                    <CustomListbox
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
                onItemsPerPageChange={(value) => { setPerPage(value); setCurrentPage(1); }}
            />
        </div>
    );
};

// Mini-componenti per la UI
const SellerInfo = ({ seller }) => (
    <div className="flex items-center gap-3">
        <img src={seller.avatarUrl} alt={seller.name} className='w-10 h-10 object-cover rounded-full' />
        <span className="font-medium text-gray-800">{seller.name}</span>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(status)}`}>
        {status}
    </span>
);

export default Sellers;