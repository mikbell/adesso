import React from 'react';
import { FiMenu } from 'react-icons/fi';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';

// Dati di esempio che verrebbero da uno stato globale (Context, Redux) o da props
const exampleUser = {
    name: 'Maria Rossi',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg', // URL di un avatar di esempio
};

const Header = ({ setShowSidebar }) => {
    const notificationCount = 5; // Anche questo dato sarebbe dinamico

    return (
        <header className='w-full py-4 px-4 bg-[#283046] z-40 shadow-sm'>
            <div className='ml-0 lg:ml-[260px] h-[65px] flex justify-between items-center px-5 transition-all duration-300 ease-in-out bg-[#343d52] rounded-lg'>

                {/* Contenitore Sinistro: Menu e Ricerca */}
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 rounded-md text-white lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setShowSidebar(true)}
                        aria-label="Apri menu laterale"
                    >
                        <FiMenu size={24} />
                    </button>
                    <div className="hidden md:block">
                        <SearchBar />
                    </div>
                </div>

                {/* Contenitore Destro: Notifiche e Profilo */}
                <div className="flex items-center gap-6">
                    <NotificationBell count={notificationCount} />
                    <ProfileDropdown user={exampleUser} />
                </div>

            </div>
        </header>
    );
};

export default Header;