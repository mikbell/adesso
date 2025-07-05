import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx'; // Utility opzionale ma consigliata per gestire le classi

const SidebarLink = ({ nav, handleLinkClick }) => {
    // Gestione delle classi più pulita con una funzione
    const getLinkClasses = ({ isActive }) => {
        const baseClasses = [
            'flex', 'items-center', 'p-3', 'rounded-lg', 'transition-all',
            'duration-200', 'ease-in-out', 'transform', 'focus:outline-none',
            'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-indigo-400',
            'focus:ring-offset-[#283046]'
        ];

        if (isActive) {
            return clsx(
                baseClasses,
                'bg-indigo-600',
                'text-white',
                'shadow-lg'
            );
        }

        return clsx(
            baseClasses,
            'text-gray-300',
            'hover:bg-gray-700/50',
            'hover:text-white',
            'hover:translate-x-1',
            'active:scale-98'
        );
    };

    return (
        <li className="mb-2">
            <NavLink
                to={nav.path}
                onClick={handleLinkClick}
                // `end` assicura che il link radice ("/") non rimanga attivo per le altre pagine
                end={nav.path === '/admin/dashboard' || nav.path === '/seller/dashboard'}
                className={getLinkClasses}
            >
                {nav.icon && <span className="mr-3 text-xl">{nav.icon}</span>}
                <span className="font-medium">{nav.title}</span>
            </NavLink>
        </li>
    );
};

export default SidebarLink;