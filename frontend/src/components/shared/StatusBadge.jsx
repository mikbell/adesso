import React from 'react';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        'Consegnato': 'bg-green-100 text-green-800',
        'In transito': 'bg-blue-100 text-blue-800',
        'In attesa': 'bg-yellow-100 text-yellow-800',
        'Annullato': 'bg-red-100 text-red-800',
        'In preparazione': 'bg-purple-100 text-purple-800',
        'Pagato': 'bg-emerald-100 text-emerald-800',
    };

    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${style}`}>
            {status}
        </span>
    );
};

export default StatusBadge;