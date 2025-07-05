import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // Se usi React Router

const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Gestisce la chiusura del menu se si clicca fuori
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Aggiungi qui la tua logica di logout
        console.log('Logout');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#343d52] focus:ring-white rounded-full p-1"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <img
                    src={user.avatarUrl || 'https://via.placeholder.com/40'}
                    alt="Avatar utente"
                    className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-400"
                />
                <span className="hidden sm:inline font-medium">{user.name}</span>
                <FiChevronDown
                    className={`hidden sm:inline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <Link
                        to="/seller/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiUser size={16} />
                        <span>Profilo</span>
                    </Link>
                    <Link
                        to="/seller/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiSettings size={16} />
                        <span>Impostazioni</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;