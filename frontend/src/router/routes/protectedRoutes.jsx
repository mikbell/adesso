import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * @description Un componente wrapper per proteggere le rotte.
 * Controlla se l'utente è autenticato e se ha il ruolo e lo stato necessari
 * per accedere alla risorsa richiesta.
 * @param {object} props - Le props del componente.
 * @param {object} props.route - L'oggetto di configurazione della rotta da proteggere.
 * @param {React.ReactNode} props.children - Il componente da renderizzare se l'accesso è consentito.
 * @returns {React.ReactNode} Il componente figlio o un reindirizzamento.
 */
const ProtectedRoute = ({ route, children }) => {
    const { userInfo } = useSelector((state) => state.auth);

    // 1. Controllo di Autenticazione
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    const { role: userRole, status: userStatus } = userInfo;

    // 2. Controllo di Autorizzazione basato sul Ruolo
    const allowedRoles = route.role ? [route.role] : route.ability || [];
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Logica Unificata per lo Stato e la Visibilità
    let allowedStatuses = [];
    if (route.status) {
        // La rotta richiede uno stato specifico (es. 'active')
        allowedStatuses = [route.status];
    } else if (route.visibility) {
        // La rotta definisce un array di stati permessi
        allowedStatuses = route.visibility;
    }

    // Se la rotta ha requisiti di stato E lo stato dell'utente non è permesso...
    if (allowedStatuses.length > 0 && !allowedStatuses.includes(userStatus)) {
        // ...reindirizza l'utente alla pagina corretta in base al SUO stato.
        if (userStatus === 'active') {
            // Un utente attivo che cerca di accedere a una pagina non per lui, va alla dashboard.
            return <Navigate to="/seller/dashboard" replace />;
        }
        if (userStatus === 'pending') {
            return <Navigate to="/seller/account-pending" replace />;
        }
        if (userStatus === 'deactive') {
            return <Navigate to="/seller/account-deactive" replace />;
        }
        // Fallback per altri stati non gestiti
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. Accesso Consentito
    // Se tutti i controlli passano, renderizza il componente richiesto.
    return <Suspense fallback={<div>Caricamento...</div>}>{children}</Suspense>;
};

export default ProtectedRoute;
