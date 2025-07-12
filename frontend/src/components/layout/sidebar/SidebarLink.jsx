import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const SidebarLink = ({ nav, handleLinkClick }) => {
    // La funzione per le classi rimane invariata e corretta
    const getLinkClasses = ({ isActive }) => {
        return clsx(
            'flex items-center p-3 rounded-lg transition-all duration-200 relative',
            isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        );
    };

    return (
        <li className="mb-2">
            <NavLink
                to={nav.path}
                onClick={handleLinkClick}
                className={getLinkClasses}
                end
            >
                {/* ▼▼▼ LA CORREZIONE È QUI ▼▼▼ */}
                {/* Ora tutto il contenuto è dentro un'unica funzione */}
                {({ isActive }) => (
                    <>
                        {/* 1. La barra laterale, che appare solo se il link è attivo */}
                        {isActive && (
                            <div className="absolute left-0 top-0 h-full w-1 bg-indigo-300 rounded-r-full animate-pulse"></div>
                        )}

                        {/* 2. L'icona e il titolo, che appaiono sempre */}
                        {nav.icon && <span className="mr-3 text-xl">{nav.icon}</span>}
                        <span className="font-medium">{nav.title}</span>
                    </>
                )}
            </NavLink>
        </li>
    );
};

export default SidebarLink;