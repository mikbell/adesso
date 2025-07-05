// src/components/OrdersTableRow.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const OrdersTableRow = ({ order, isExpanded, onToggle, getStatusClasses, getOrderProducts }) => {
    return (
        <>
            {/* Riga principale (cliccabile per espandere) */}
            <tr className="w-full hover:bg-gray-50 cursor-pointer h-[60px]" onClick={() => onToggle(order.id)}>
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
                        {isExpanded ? 'Comprimi' : 'Dettagli'}
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                </td>
            </tr>

            {/* Riga espansa (dettagli ordine) */}
            {isExpanded && (
                <tr key={`${order.id}-expanded`} id={`order-details-${order.id}`} className="bg-gray-50 transition-all duration-300 ease-in-out">
                    <td colSpan="6" className="px-6 py-4">
                        <div className="p-4 border border-gray-200 rounded-md bg-white">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">
                                Prodotti dell'ordine {order.id}:
                            </h4>

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
                                <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                    Visualizza Ordine Completo &rarr;
                                </Link>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default OrdersTableRow;
