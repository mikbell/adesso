// src/components/SellersTableRow.jsx
import React from 'react';


const SellersTableRow = ({ seller }) => {
    const getStatusClasses = (statusString) => {
        switch (statusString) {
            case 'Attivo': return 'bg-green-100 text-green-800';
            case 'Inattivo': return 'bg-red-100 text-red-800';
            case 'In attesa': return 'bg-yellow-100 text-yellow-800';
            case 'Rifiutato': return 'bg-gray-100 text-gray-800';
            case 'Confermato': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (

        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {seller.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <img
                    src={seller.image}
                    alt={seller.name}
                    className='w-16 h-16 object-cover rounded-full border border-gray-200'
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/64/CCCCCC/666666?text=SL" }}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                {seller.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {seller.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {seller.paymentStatus && (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(seller.paymentStatus)}`}>
                        {seller.paymentStatus}
                    </span>
                )}
                {!seller.paymentStatus && (
                    <span className="text-gray-500">N/A</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(seller.status)}`}>
                    {seller.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {seller.productsCount}
            </td>
        </tr>
    );
};

export default SellersTableRow;