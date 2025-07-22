import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import {
    LoadingPage,
    Breadcrumbs,
} from '@adesso/ui-components';

import {
    getProductById,
    clearProductState,
    getReviewsByProductId, // Importa la nuova azione per le recensioni
    submitProductReview, // Importa la nuova azione per inviare una recensione
    reviewSubmitReset, // Importa l'azione per resettare lo stato di invio
    clearReviewsState // Importa l'azione per pulire lo stato delle recensioni
} from '@adesso/core-logic'; // Assicurati che questi importi siano corretti dal tuo core-logic

import Tabs from '../components/details/Tabs';
import RecommendedProducts from '../components/details/RecommendedProducts'; // Correzione del nome del file
import ProductDetails from '../components/details/ProductDetails';

// Considera di spostare i dati mock a un file separato o di recuperarli dinamicamente
const mockRecommendedProducts = [
    {
        id: 'rec-1',
        name: 'Prodotto Simile A',
        price: 49.99,
        imageUrl: 'https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Prodotto+A',
        rating: 4.5,
    },
    {
        id: 'rec-2',
        name: 'Accessorio Utile',
        price: 19.99,
        imageUrl: 'https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Prodotto+B',
        rating: 3.8,
    },
    {
        id: 'rec-3',
        name: 'Articolo Correlato',
        price: 75.00,
        imageUrl: 'https://via.placeholder.com/300x200/3357FF/FFFFFF?text=Prodotto+C',
        rating: 5,
    },
    {
        id: 'rec-4',
        name: 'Offerta Speciale',
        price: 29.99,
        imageUrl: 'https://via.placeholder.com/300x200/F4FF33/000000?text=Prodotto+D',
        rating: 4.2,
    },
];

const Details = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();

    const { product, loader, errorMessage } = useSelector(state => state.product);
    // Seleziona lo stato delle recensioni dal nuovo reviewSlice
    const {
        reviews,
        loading: reviewsLoading,
        error: reviewsError,
        submitLoading,
        submitSuccess,
        submitError,
    } = useSelector(state => state.review);

    const { user } = useSelector(state => state.user || {}); // Presupponendo un userSlice per l'utente loggato

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Fetch product details based on the slug
        dispatch(getProductById(slug));

        // Cleanup: Clear product state and reviews state when component unmounts or slug changes
        return () => {
            dispatch(clearProductState());
            dispatch(clearReviewsState()); // Pulisce lo stato delle recensioni
        };
    }, [slug, dispatch]);

    // Fetch reviews once the product data is available (specifically product._id)
    useEffect(() => {
        if (product?._id) { // Solo se product._id è disponibile
            dispatch(getReviewsByProductId(product._id));
        }
    }, [product?._id, dispatch]); // Dipende dall'ID del prodotto

    useEffect(() => {
        // Display error message if product fetching fails
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    // Gestione dell'aggiunta al carrello
    const handleAddToCart = () => {
        if (!product) {
            toast.error("Impossibile aggiungere il prodotto al carrello: dati non disponibili.");
            return;
        }
        // TODO: integrazione logica reale per l'aggiunta al carrello
        console.log(`Aggiunto al carrello: ${quantity} x ${product.name}`);
        toast.success(`${product.name} aggiunto al carrello!`);
    };

    // Gestione dell'invio della recensione
    const handleReviewSubmit = (rating, comment) => {
        if (!product?._id) {
            toast.error("Errore: ID prodotto non disponibile per l'invio della recensione.");
            return;
        }
        dispatch(submitProductReview({
            productId: product._id,
            reviewData: {
                rating,
                comment,
            },
        }));
    };

    // Effetti collaterali per l'invio della recensione (successo/errore)
    useEffect(() => {
        if (submitSuccess) {
            toast.success('Recensione inviata con successo!');
            // Ricarica le recensioni dopo l'invio per vedere quella nuova
            dispatch(getReviewsByProductId(product._id));
            dispatch(reviewSubmitReset()); // Resetta lo stato di invio
        }
        if (submitError) {
            toast.error(submitError);
            dispatch(reviewSubmitReset());
        }
    }, [submitSuccess, submitError, dispatch, product?._id]);

    // --- Conditional Rendering for Loading, Error, and No Product ---

    if (loader) {
        return <LoadingPage />;
    }

    if (!product) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg m-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prodotto non disponibile</h2>
                <p className="text-gray-600">Spiacenti, il prodotto che stai cercando non è stato trovato o non è più disponibile.</p>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                    Torna alla Home
                </Link>
            </div>
        );
    }

    // Helper for stock status classes and text
    const stockStatusClasses = product.stock > 10
        ? 'text-green-600' // High availability
        : product.stock > 0
            ? 'text-yellow-600' // Low availability
            : 'text-red-600'; // Out of stock

    const stockStatusText = product.stock > 0
        ? `Disponibilità: ${product.stock} in stock`
        : 'Esaurito';

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
                <div className="mb-6 lg:mb-8">
                    <Breadcrumbs product={product} />
                </div>

                {/* Product Details Section */}
                <ProductDetails
                    product={product}
                    stockStatusText={stockStatusText}
                    stockStatusClasses={stockStatusClasses}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    handleAddToCart={handleAddToCart}
                />

                {/* Tabs Section (Description, Reviews) */}
                <Tabs
                    product={product}
                    reviews={reviews}
                    reviewsLoading={reviewsLoading}
                    reviewsError={reviewsError}
                    submitLoading={submitLoading}
                    submitError={submitError}
                    submitSuccess={submitSuccess}
                    handleReviewSubmit={handleReviewSubmit}
                    user={user} // Passa le informazioni sull'utente per la logica di recensione
                />

                {/* Recommended Products Section */}
                <RecommendedProducts products={mockRecommendedProducts} />
            </div>
        </div>
    );
};

export default Details;