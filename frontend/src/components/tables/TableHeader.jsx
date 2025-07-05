// src/components/TableHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const TableHeader = ({ title, showSearch, searchTerm, handleSearchChange, showViewAllLink, viewAllLinkTo }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 p-3 bg-gray-50 rounded-lg">
            {title && <h2 className="text-xl font-bold text-gray-800 flex-shrink-0">{title}</h2>}

            <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end">
                {showSearch && (
                    <div className="relative w-full sm:w-auto sm:flex-grow max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cerca..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}
                {showViewAllLink && (
                    <Link to={viewAllLinkTo} className='text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0'>
                        Mostra Tutti
                    </Link>
                )}
            </div>
        </div>
    );
};

export default TableHeader;