// SearchBar.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
    return (
        <div className="relative hidden md:block">
            <input
                type="text"
                placeholder="Cerca prodotto..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-800 border border-transparent
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
    );
};

export default SearchBar;