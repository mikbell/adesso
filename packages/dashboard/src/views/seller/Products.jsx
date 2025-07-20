import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti UI e Icone
import { TableHeader, StandardTable, TablePagination, ActionsMenu, LoadingPage, SmartPrice } from '@adesso/ui-components';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

// Azioni Redux
import { getProducts, deleteProduct, clearProductMessages } from '@adesso/core-logic';

// Hook per il debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};


const Products = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Stato Redux
    const { products, totalProducts, loader, successMessage, errorMessage } = useSelector(state => state.product);

    // Stato locale per UI (paginazione e ricerca)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    // Chiamata API semplificata
    useEffect(() => {
        dispatch(getProducts({
            page: currentPage,
            perPage: itemsPerPage,
            search: debouncedSearchTerm,
        }));
    }, [dispatch, currentPage, itemsPerPage, debouncedSearchTerm]);

    // Gestione messaggi
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearProductMessages());
            // Ricarica i dati dopo un'azione andata a buon fine
            dispatch(getProducts({ page: currentPage, perPage: itemsPerPage, search: debouncedSearchTerm }));
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearProductMessages());
        }
    }, [successMessage, errorMessage, dispatch, currentPage, itemsPerPage, debouncedSearchTerm]);

    // Funzione per l'eliminazione
    const handleDelete = (product) => {
        if (window.confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
            dispatch(deleteProduct(product._id));
        }
    };

    // 1. SET DI AZIONI UNIFICATO
    const productActions = [
        { key: 'standard-actions', items: [{ label: 'Visualizza', icon: FiEye, onClick: (p) => navigate(`/seller/dashboard/products/${p._id}/view`) }, { label: 'Modifica', icon: FiEdit, onClick: (p) => navigate(`/seller/dashboard/products/${p._id}/edit`) }] },
        { key: 'destructive-actions', items: [{ label: 'Elimina', icon: FiTrash2, onClick: handleDelete, isDestructive: true }] }
    ];

    // 2. DEFINIZIONE DELLE COLONNE CON LOGICA CONDIZIONALE
    const columns = useMemo(() => [
        {
            header: 'Prodotto',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <img src={item.images && item.images[0] ? item.images[0].url : 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                    <span className="font-medium text-gray-900">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Prezzo',
            render: (item) => {
                // Se non c'è sconto, mostra solo il prezzo normale
                if (!item.discount || item.discount === 0) {
                    return `€${item.price.toFixed(2)}`;
                }

                // Se c'è uno sconto, mostra la vista completa
                const discountedPrice = item.price - (item.price * item.discount / 100);
                return (
                    <SmartPrice product={item} hasDiscount={true} discountedPrice={discountedPrice} />
                );
            }
        },
        { header: 'Stock', render: (item) => (<span className={`font-medium ${item.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>{item.stock}</span>) },
        { header: 'Stato', accessor: 'status' },
        {
            header: 'Azioni',
            render: (product) => (
                <div className="flex justify-end">
                    <ActionsMenu item={product} actionGroups={productActions} />
                </div>
            )
        }
    ], []);

    if (loader && !products.length) return <LoadingPage />;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="w-full p-4 bg-white rounded-lg shadow-md">
                <TableHeader
                    title="Tutti i Prodotti"
                    showSearch={true}
                    searchTerm={searchInput}
                    handleSearchChange={(e) => setSearchInput(e.target.value)}
                    buttonText="Aggiungi Prodotto"
                    onButtonClick={() => navigate('/seller/dashboard/products/add')}
                />
                <div className="relative">
                    {loader && (<div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10"></div>)}
                    <StandardTable
                        columns={columns}
                        data={products}
                    />
                </div>
                {totalProducts > 0 && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalProducts / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        totalItems={totalProducts}
                    />
                )}
            </div>
        </div>
    );
};

export default Products;