import React from 'react';
import { FiSearch } from 'react-icons/fi';
import SellerListItem from './SellerListItem';

const SellerList = ({ sellers, selectedSellerId, onSellerSelect, searchTerm, onSearchChange }) => {
    return (
        <aside className="w-1/3 max-w-sm bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cerca venditori..."
                        className="w-full p-2 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {sellers.length > 0 ? (
                    sellers.map((seller) => (
                        <SellerListItem
                            key={seller.id}
                            seller={seller}
                            isSelected={seller.id === selectedSellerId}
                            onSelect={() => onSellerSelect(seller)}
                        />
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-gray-500">Nessun venditore trovato.</p>
                )}
            </div>
        </aside>
    );
};

export default SellerList;