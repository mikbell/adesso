import React from 'react';
import { FiMenu } from 'react-icons/fi';
import NotificationBell from './NotificationBell';

const Header = ({ setShowSidebar }) => {
    const notificationCount = 5; // Dato dinamico

    return (
        <header className='fixed top-0 left-0 w-full py-2 px-4 bg-white z-40 shadow-sm border-b border-gray-200'>
            <div className='lg:ml-[260px] h-[65px] flex justify-between items-center px-5 transition-all duration-300 ease-in-out'>

                {/* Contenitore Sinistro */}
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 rounded-md text-gray-600 lg:hidden"
                        onClick={() => setShowSidebar(true)}
                        aria-label="Apri menu laterale"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* Contenitore Destro */}
                <div className="flex items-center gap-6">
                    <NotificationBell count={notificationCount} />
                </div>
            </div>
        </header>
    );
};

export default Header;