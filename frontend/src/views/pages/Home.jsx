import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loading from '../../components/shared/Loading';


/**
 * @description Questo componente agisce come un punto di ingresso ("gatekeeper") alla radice dell'app.
 * Reindirizza gli utenti alla loro dashboard specifica se sono autenticati,
 * o alla pagina di login in caso contrario. Gestisce anche lo stato di caricamento.
 */
const Home = () => {
    // Selezioniamo sia `role` che `loader` dallo stato di autenticazione.
    // Il `loader` ci dice se un'operazione asincrona (come getUserInfo) è in corso.
    const { role, loader } = useSelector((state) => state.auth);

    // Se l'app sta ancora verificando lo stato dell'utente (es. al primo caricamento),
    // mostriamo un indicatore di caricamento invece di reindirizzare immediatamente.
    // Questo previene un flash indesiderato della pagina di login per gli utenti già autenticati.
    if (loader) {
        return <Loading />;
    }

    // Una volta che il caricamento è terminato, la logica di reindirizzamento può procedere.
    if (role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />;
    }

    if (role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Se non c'è nessun loader attivo e nessun ruolo, l'utente non è autenticato.
    return <Navigate to="/login" replace />;
};

export default Home;
