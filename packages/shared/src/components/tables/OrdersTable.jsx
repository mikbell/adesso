import React, { useState, useMemo } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import TableHeader from './TableHeader'; // Reutilizza TableHeader
import TablePagination from './TablePagination'; // Reutilizza TablePagination
import CustomButton from '../shared/CustomButton';

// Questo componente si occuperà solo della riga, incluso l'espansione
// Non ha bisogno di essere exportato se usato solo qui, ma per chiarezza lo manteniamo
const OrdersTableRow = ({ order, isExpanded, onToggle, getStatusClasses, getOrderProducts }) => {
    return (
        <React.Fragment>
            {/* Rimuoviamo altezza fissa dalla riga principale */}
            <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onToggle(order.id)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(order.id); }}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1"
                        aria-expanded={isExpanded}
                        aria-controls={`order-details-${order.id}`}
                    >
                        {isExpanded ? 'Comprimi ' : 'Dettagli '}
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                </td>
            </tr>
            {isExpanded && (
                <tr id={`order-details-${order.id}`} className="bg-gray-50 transition-all duration-300 ease-in-out">
                    {/* La riga espansa ha colSpan per coprire tutta la larghezza */}
                    <td colSpan="6" className="px-6 py-4">
                        <div className="p-4 border border-gray-200 rounded-md bg-white">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Prodotti dell'ordine {order.id}:</h4>
                            {getOrderProducts(order.id).length === 0 ? (
                                <p className="text-sm text-gray-600">Nessun prodotto trovato per questo ordine.</p>
                            ) : (
                                <ul className="list-disc pl-5 space-y-1">
                                    {getOrderProducts(order.id).map(product => (
                                        <li key={product.id} className="text-sm text-gray-700">
                                            {product.name} (x{product.qty}) - {product.price}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="mt-4 text-right">
                                <CustomButton to={`/admin/dashboard/orders/${order.id}`} variant="link">
                                    Visualizza Ordine Completo &rarr;
                                </CustomButton>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

const OrdersTable = ({ orders, title = "Ordini", showViewAllLink = false }) => {
    // Stato per la paginazione, ricerca e espansione
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Rinominato da ordersPerPage a itemsPerPage
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Funzione per simulare il recupero dei prodotti di un ordine
    const getOrderProducts = (orderId) => {
        // ... (la tua logica getOrderProducts rimane invariata)
        switch (orderId) {
            case '#12345': return [{ id: 'P001', name: 'Smartphone X', qty: 1, price: '€599.00' }, { id: 'P002', name: 'Custodia per Smartphone', qty: 1, price: '€15.00' }];
            case '#12346': return [{ id: 'P003', name: 'Smartwatch Y', qty: 1, price: '€199.50' }, { id: 'P004', name: 'Cinturino Extra', qty: 1, price: '€20.00' }];
            case '#12347': return [{ id: 'P005', name: 'Cuffie Bluetooth', qty: 1, price: '€75.00' }];
            case '#12348': return [{ id: 'P006', name: 'Laptop Z', qty: 1, price: '€1200.00' }, { id: 'P007', name: 'Borsa per Laptop', qty: 1, price: '€40.00' }];
            case '#12349': return [{ id: 'P008', name: 'Mouse Wireless', qty: 1, price: '€25.99' }, { id: 'P009', name: 'Tappetino Mouse', qty: 1, price: '€5.00' }];
            case '#12350': return [{ id: 'P010', name: 'Tastiera Meccanica', qty: 1, price: '€89.99' }];
            default: return [];
        }
    };

    // Funzione per determinare le classi di stile dello stato
    const getStatusClasses = (status) => {
        switch (status) {
            case 'Consegnato': return 'bg-green-100 text-green-800';
            case 'In transito': return 'bg-blue-100 text-blue-800';
            case 'In attesa': return 'bg-yellow-100 text-yellow-800';
            case 'Annullato': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Filtra i dati basandosi sul termine di ricerca
    const filteredOrders = useMemo(() => {
        if (!searchTerm || !orders) {
            return orders;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return orders.filter(order =>
            order.id.toLowerCase().includes(lowercasedSearchTerm) ||
            order.product.toLowerCase().includes(lowercasedSearchTerm) ||
            order.status.toLowerCase().includes(lowercasedSearchTerm) ||
            order.price.toLowerCase().includes(lowercasedSearchTerm) ||
            order.date.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [orders, searchTerm]);

    // Applica la paginazione agli ordini filtrati
    const currentOrders = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredOrders, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (e) => { // Rinominato da handleOrdersPerPageChange
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        setExpandedOrderId(null); // Chiudi qualsiasi riga espansa quando la ricerca cambia
    };

    const toggleRow = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md overflow-x-auto">
            {/* Intestazione della tabella con ricerca e link */}
            <TableHeader
                title={title}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                showSearch={true}
                showViewAllLink={showViewAllLink}
                viewAllLinkTo="/orders" // Specifico per ordini
            />

            {/* Messaggi di stato per la tabella */}
            {filteredOrders.length === 0 && searchTerm ? (
                <p className="text-gray-500 text-center py-8">Nessun ordine trovato per "{searchTerm}".</p>
            ) : filteredOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nessun ordine disponibile.</p>
            ) : (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Ordine</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodotto Principale</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prezzo Totale</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Dettagli / Azioni</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map((order) => (
                                <OrdersTableRow
                                    key={order.id}
                                    order={order}
                                    isExpanded={expandedOrderId === order.id}
                                    onToggle={toggleRow}
                                    getStatusClasses={getStatusClasses}
                                    getOrderProducts={getOrderProducts}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Controlli di paginazione */}
                    {totalPages > 1 && (
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default OrdersTable;