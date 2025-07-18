import React from 'react';

const CustomerListItem = ({ customer, isSelected, onSelect }) => (
    <div onClick={() => onSelect(customer)} className={`flex items-center p-3 cursor-pointer ${isSelected ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}>
        <div className="relative mr-3">
            <img src={customer.image} alt={customer.name} className="w-10 h-10 rounded-full" />
            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white ${customer.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </div>
        <div>
            <p className="font-semibold text-gray-800">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
    </div>
);
export default CustomerListItem;