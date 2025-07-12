// src/views/Home.jsx (Nessuna modifica sostanziale necessaria)
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoadingPage from '../../components/shared/LoadingPage';

const Home = () => {
    const { userInfo, loader } = useSelector((state) => state.auth);

    // Mostra il caricamento mentre si verifica lo stato dell'utente
    if (loader && !userInfo) {
        return <LoadingPage />;
    }

    // Se c'è un utente, reindirizza alla sua dashboard
    if (userInfo?.role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />;
    }
    if (userInfo?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Se non c'è utente e non sta caricando, vai al login
    return <Navigate to="/login" replace />;
};

export default Home;