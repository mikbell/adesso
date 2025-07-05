import React from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationBell = ({ count }) => {
    return (
        <button className="relative p-1 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#343d52] focus:ring-white rounded-full">
            <FiBell size={24} />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#343d52]">
                    {count}
                </span>
            )}
            <span className="sr-only">Notifiche</span>
        </button>
    );
};

export default NotificationBell;