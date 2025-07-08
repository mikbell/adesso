import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNavs } from '../../../navigation/navigation'; // Assicurati che il percorso sia corretto
import { logout } from '../../../store/reducers/authReducer'; // Importa l'azione di logout
import SidebarLink from './SidebarLink'; // Componente per il singolo link
import { MdLogout } from "react-icons/md";

// Rimuoviamo `userRole` dalle props, il componente ora ottiene i dati da Redux.
const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Otteniamo l'intero oggetto userInfo dallo stato di Redux.
    // È la nostra unica fonte di verità.
    const { userInfo } = useSelector((state) => state.auth);

    const [allNav, setAllNav] = useState([]);

    // Effetto per caricare i link di navigazione quando userInfo cambia.
    useEffect(() => {
        // Procediamo solo se abbiamo le informazioni dell'utente.
        if (userInfo) {
            // Usiamo sia il ruolo che lo stato per ottenere i link corretti.
            const navs = getNavs(userInfo.role, userInfo.status);
            setAllNav(navs);
        }
    }, [userInfo]); // La dipendenza è userInfo, quindi si aggiorna al login/logout.

    // Chiude la sidebar su schermi piccoli dopo un click su un link.
    const handleLinkClick = useCallback(() => {
        if (showSidebar) {
            setShowSidebar(false);
        }
    }, [showSidebar, setShowSidebar]);

    // Gestisce il logout dell'utente.
    const handleLogout = () => {
        dispatch(logout()); // Invia l'azione di logout a Redux.
        navigate('/login'); // Reindirizza l'utente alla pagina di login.
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
                {/* 1. Intestazione (Logo) */}
                <div className="flex flex-col justify-center items-center h-[100px] flex-shrink-0">
                    <Link to='/' className="text-center" onClick={handleLinkClick}>
                        <h2 className="text-white text-3xl font-bold tracking-wider">Adesso</h2>
                        {userInfo && (
                            <span className="text-gray-400 text-[10px] tracking-widest uppercase">
                                Pannello {userInfo.role}
                            </span>
                        )}
                    </Link>
                    <div className="w-3/4 h-px bg-gray-600 mt-3"></div>
                </div>

                {/* 2. Navigazione Principale */}
                <nav className="flex-grow overflow-y-auto px-4 pb-4">
                    <ul>
                        {allNav.map((nav) => (
                            <SidebarLink
                                key={nav.id}
                                nav={nav}
                                isActive={pathname === nav.path}
                                handleLinkClick={handleLinkClick}
                            />
                        ))}
                    </ul>
                </nav>

                {/* 3. Piè di pagina (Logout) */}
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
