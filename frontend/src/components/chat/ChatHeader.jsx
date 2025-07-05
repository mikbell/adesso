import React from 'react';
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ChatHeader = ({ seller }) => (
    <header className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Chat con {seller.name}</h2>
        <Link
            to={`/admin/dashboard/sellers/${seller.id}`}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
            <FiEye size={16} />
            Vedi Dettagli
        </Link>
    </header>
);

export default ChatHeader;