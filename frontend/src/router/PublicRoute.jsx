import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * @description Un componente wrapper per proteggere le rotte pubbliche.
 * Se un utente è già autenticato, lo reindirizza alla sua dashboard
 * per impedirgli di visualizzare nuovamente le pagine di login o registrazione.
 * @param {object} props - Le props del componente.
 * @param {React.ReactNode} props.children - Il componente pubblico da renderizzare (es. <Login />).
 * @returns {React.ReactNode} Il componente figlio o un reindirizzamento alla dashboard.
 */
const PublicRoute = ({ children }) => {
    // Recupera le informazioni dell'utente dallo stato di Redux
    const { userInfo } = useSelector((state) => state.auth);

    // Se l'utente è già loggato...
    if (userInfo) {
        // ...reindirizzalo alla sua dashboard specifica.
        if (userInfo.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/seller/dashboard" replace />;
    }

    // Se l'utente non è loggato, mostra la pagina pubblica richiesta (es. Login, Register)
    return children;
};

export default PublicRoute;