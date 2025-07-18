// src/components/PaymentRequestsTableRow.jsx
import React from 'react';
import CustomButton from '../shared/CustomButton'; // Importa il tuo componente CustomButton

const PaymentRequestsTableRow = ({ request, onConfirm }) => {
    // Funzione per determinare le classi di stile dello stato del pagamento
    const getStatusClasses = (status) => {
        switch (status) {
            case 'In attesa':
                return 'bg-yellow-100 text-yellow-800';
            case 'Confermato':
                return 'bg-green-100 text-green-800';
            case 'Rifiutato':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {request.number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {request.amount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(request.status)}`}>
                    {request.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {request.date}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {request.status === 'In attesa' ? (
                    <CustomButton
                        onClick={() => onConfirm(request.number)}
                        variant="success"
                        size="sm"
                    >
                        Conferma
                    </CustomButton>
                ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(request.status)}`}>
                        {request.status === 'Confermato' ? 'Già confermato' : 'Azione non disponibile'}
                    </span>
                )}
            </td>
        </tr>
    );
};

export default PaymentRequestsTableRow;