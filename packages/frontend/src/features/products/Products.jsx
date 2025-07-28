// src/features/products/Products.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// -> Importa tutte le azioni (thunks) dalla tua libreria core-logic
import {
    getProducts, // Potrebbe ancora servire per un uso generico o di fallback
    getLatestProducts,
    getDiscountedProducts,
    getTopRatedProducts
} from '@adesso/core-logic';
// -> Importa il componente UI dalla tua libreria UI
import { ProductCarousel } from '@adesso/ui-components';

/**
 * Componente Products flessibile che visualizza diverse liste di prodotti in un carosello.
 *
 * @param {object} props - Le proprietà del componente.
 * @param {'latest' | 'discounted' | 'topRated' | 'general'} props.type - Il tipo di prodotti da visualizzare.
 * @param {string} [props.customTitle] - Un titolo personalizzato per il carosello. Se non fornito, usa un titolo predefinito basato sul 'type'.
 * @param {number} [props.limit=9] - Il numero massimo di prodotti da caricare.
 * @param {number} [props.minReviews=3] - Il numero minimo di recensioni per i prodotti 'topRated'.
 */
const Products = ({ type = 'latest', customTitle, limit = 9, minReviews = 3 }) => {
    const dispatch = useDispatch();

    // Accedi a tutti gli array di prodotti e allo stato di caricamento dallo slice 'product'
    const {
        products: generalProducts, // 'products' è l'array generico usato da getProducts
        latestProducts,
        discountedProducts,
        topRatedProducts,
        loader
    } = useSelector((state) => state.product);

    let productsToDisplay = [];
    let carouselTitle = "";

    // Logica per determinare quali prodotti visualizzare e quale titolo usare
    switch (type) {
        case 'latest':
            productsToDisplay = latestProducts;
            carouselTitle = customTitle || "Ultimi Arrivi";
            break;
        case 'discounted':
            productsToDisplay = discountedProducts;
            carouselTitle = customTitle || "Offerte Speciali";
            break;
        case 'topRated':
            productsToDisplay = topRatedProducts;
            carouselTitle = customTitle || "I Più Votati";
            break;
        case 'general': // In caso tu voglia un utilizzo generico con getProducts
            productsToDisplay = generalProducts;
            carouselTitle = customTitle || "Prodotti del Catalogo";
            break;
        default:
            productsToDisplay = latestProducts; // Fallback predefinito
            carouselTitle = customTitle || "Prodotti";
            console.warn(`Products component received unknown type: ${type}. Defaulting to 'latest'.`);
            break;
    }

    useEffect(() => {
        // Dispatch del thunk corretto in base al 'type' prop
        if (type === 'latest') {
            dispatch(getLatestProducts(limit));
        } else if (type === 'discounted') {
            dispatch(getDiscountedProducts(limit));
        } else if (type === 'topRated') {
            dispatch(getTopRatedProducts({ limit, minReviews }));
        } else if (type === 'general') {
            // Se 'general', si assume che getProducts possa prendere paginazione e ricerca
            // Adatta questi parametri se 'general' Products verrà usato in modo diverso
            dispatch(getProducts({ page: 1, perPage: limit, search: '' }));
        }
    }, [dispatch, type, limit, minReviews]); // Ricarica se questi props cambiano

    return (
        <ProductCarousel
            title={carouselTitle}
            products={productsToDisplay}
            isLoading={loader} // loader è lo stato di caricamento globale per lo slice
        />
    );
};

export default Products;