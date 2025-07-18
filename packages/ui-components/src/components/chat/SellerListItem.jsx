import React from 'react';

const SellerListItem = ({ seller, isSelected, onSelect }) => {
    const placeholderImage = "https://i.pravatar.cc/300";

    return (
        <div
            className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-indigo-100' : 'hover:bg-gray-100'
                }`}
            onClick={onSelect}
        >
            {/* Contenitore per Avatar e Indicatore di Stato */}
            <div className="relative mr-3 flex-shrink-0">
                <img
                    src={seller.image || placeholderImage}
                    alt={seller.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.src = placeholderImage; }}
                />
                {/* Indicatore di Stato (Pallino) */}
                <span
                    className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${seller.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    title={seller.isActive ? 'Online' : 'Offline'}
                ></span>
            </div>

            {/* Dettagli del venditore */}
            <div className="flex-1 overflow-hidden">
                <p className={`font-semibold truncate ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
                    {seller.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{seller.email}</p>
            </div>
        </div>
    );
};

export default SellerListItem;