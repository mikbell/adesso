import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import {
    LoadingPage,
    Breadcrumbs,
} from '@adesso/ui-components';

import {
    getProductById,
    clearProductState,
    getReviewsByProductId,
    submitProductReview,
    reviewSubmitReset,
    clearReviewsState,
    addToCart,
} from '@adesso/core-logic';

import Tabs from '../components/details/Tabs';
import RecommendedProducts from '../components/details/RecommendedProducts';
import ProductDetails from '../components/details/ProductDetails';

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
        name: 'Prodotto Simile B',
        price: 39.99,
        imageUrl: 'https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Prodotto+B',
        rating: 4.0,
    },
    {
        id: 'rec-3',
        name: 'Prodotto Simile C',
        price: 59.99,
        imageUrl: 'https://via.placeholder.com/300x200/5733FF/FFFFFF?text=Prodotto+C',
        rating: 3.8,
    },];

const Details = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Inizializza useNavigate per la navigazione programmatica

    const { product, loader, errorMessage } = useSelector(state => state.product);
    const {
        reviews,
        loading: reviewsLoading,
        error: reviewsError,
        submitLoading,
        submitSuccess,
        submitError,
    } = useSelector(state => state.review);

    const { userInfo } = useSelector(state => state.auth || {});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        dispatch(getProductById(slug));
        return () => {
            dispatch(clearProductState());
            dispatch(clearReviewsState());
        };
    }, [slug, dispatch]);

    useEffect(() => {
        if (product?._id) {
            dispatch(getReviewsByProductId(product._id));
        }
    }, [product?._id, dispatch]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    const handleAddToCart = () => {
        if (!userInfo) {
            toast.error("Devi essere loggato per aggiungere prodotti al carrello.");
            navigate('/login'); // Reindirizza l'utente alla pagina di login
            return;
        }

        if (!product || !product._id) {
            toast.error("Impossibile aggiungere il prodotto al carrello: dati non disponibili.");
            return;
        }

        const productData = {
            productId: product._id,
            quantity: quantity,
        };

        dispatch(addToCart(productData));
    };

    const handleReviewSubmit = (rating, comment) => {
        if (!userInfo) {
            toast.error("Devi essere loggato per inviare una recensione.");
            navigate('/login');
            return;
        }

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

    useEffect(() => {
        if (submitSuccess) {
            toast.success('Recensione inviata con successo!');
            dispatch(getReviewsByProductId(product._id));
            dispatch(reviewSubmitReset());
        }
        if (submitError) {
            toast.error(submitError);
            dispatch(reviewSubmitReset());
        }
    }, [submitSuccess, submitError, dispatch, product?._id]);

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

    const stockStatusClasses = product.stock > 10
        ? 'text-green-600'
        : product.stock > 0
            ? 'text-yellow-600'
            : 'text-red-600';

    const stockStatusText = product.stock > 0
        ? `Disponibilità: ${product.stock} in stock`
        : 'Esaurito';

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
                <div className="mb-6 lg:mb-8">
                    <Breadcrumbs product={product} />
                </div>

                {/* Passa l'oggetto 'userInfo' al componente ProductDetails */}
                <ProductDetails
                    product={product}
                    stockStatusText={stockStatusText}
                    stockStatusClasses={stockStatusClasses}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    handleAddToCart={handleAddToCart}
                    userInfo={userInfo} // NUOVO: Passa l'utente
                />

                <Tabs
                    product={product}
                    reviews={reviews}
                    reviewsLoading={reviewsLoading}
                    reviewsError={reviewsError}
                    submitLoading={submitLoading}
                    submitError={submitError}
                    submitSuccess={submitSuccess}
                    handleReviewSubmit={handleReviewSubmit}
                    userInfo={userInfo}
                />

                <RecommendedProducts products={mockRecommendedProducts} />
            </div>
        </div>
    );
};

export default Details;