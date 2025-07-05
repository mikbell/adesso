import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
    return (
        <div className="relative flex-grow max-w-sm">
            <input
                type="text"
                placeholder="Cerca..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#283046] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                aria-label="Campo di ricerca"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
    );
};

export default SearchBar;