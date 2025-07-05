import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getNav } from '../../../navigation/index';
import SidebarLink from './SidebarLink';
import { MdLogout } from "react-icons/md";

const Sidebar = ({ showSidebar, setShowSidebar, userRole }) => {
    const [allNav, setAllNav] = useState([]);
    const { pathname } = useLocation();

    // Carica la navigazione in base al ruolo dell'utente
    useEffect(() => {
        if (userRole) {
            const navs = getNav(userRole);
            setAllNav(navs);
        }
    }, [userRole]);

    // Chiude la sidebar su schermi piccoli dopo un click
    const handleLinkClick = useCallback(() => {
        if (showSidebar) {
            setShowSidebar(false);
        }
    }, [showSidebar, setShowSidebar]);

    const handleLogout = () => {
        // Qui andrà la tua logica di logout (es. pulire token, dispatch di un'azione)
        console.log("Eseguo il logout...");
        handleLinkClick();
    };

    const sidebarClasses = `
    fixed top-0 left-0 h-screen w-[260px] 
    bg-[#283046] text-white
    flex flex-col
    transition-transform duration-300 ease-in-out z-50
    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static
  `;

    return (
        <>
            {/* Overlay per schermi mobili */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={sidebarClasses}>
                {/* 1. Intestazione (Logo) - non scrollabile */}
                <div className="flex flex-col justify-center items-center h-[100px] flex-shrink-0">
                    <Link to='/' className="text-center" onClick={handleLinkClick}>
                        <h2 className="text-white text-3xl font-bold tracking-wider">Adesso</h2>
                        <span className="text-gray-400 text-[10px] tracking-widest uppercase">
                            Pannello {userRole}
                        </span>
                    </Link>
                    <div className="w-3/4 h-px bg-gray-600 mt-3"></div>
                </div>

                {/* 2. Navigazione Principale - scrollabile */}
                <nav className="flex-grow overflow-y-auto px-4 pb-4">
                    <ul>
                        {allNav.map((nav) => (
                            // Best Practice: usare un ID univoco per la key, non l'indice
                            <SidebarLink
                                key={nav.id}
                                nav={nav}
                                isActive={pathname === nav.path}
                                handleLinkClick={handleLinkClick}
                            />
                        ))}
                    </ul>
                </nav>

                {/* 3. Piè di pagina (Logout) - non scrollabile */}
                <div className="p-4 flex-shrink-0 border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
                    >
                        <MdLogout className="text-xl" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;