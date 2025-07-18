// NotificationBell.jsx
import React from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationBell = ({ count }) => {
    return (
        <button className="relative p-1 text-gray-500 hover:text-indigo-600">
            <FiBell size={24} />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {count}
                </span>
            )}
        </button>
    );
};

export default NotificationBell;