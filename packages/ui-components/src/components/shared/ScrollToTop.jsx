// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // "document.documentElement.scrollTo" for IE, Safari, Chrome
        // "document.body.scrollTo" for Firefox, Opera
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Usa 'instant' per uno scorrimento immediato senza animazione
        });
        // Oppure semplicemente: window.scrollTo(0, 0);
    }, [pathname]); // Dipende dal pathname: ogni volta che l'URL cambia, scorri su

    return null; // Questo componente non renderizza nulla nella DOM
}

export default ScrollToTop;