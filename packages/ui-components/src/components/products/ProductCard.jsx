import React from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import CustomButton from '../shared/CustomButton';
import SmartPrice from '../shared/SmartPrice';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useDispatch, useSelector } from 'react-redux'; // Importa useSelector
import { addToCart } from '@adesso/core-logic';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    // Accedi allo stato dell'utente dallo store Redux
    const { userInfo } = useSelector(state => state.auth || {});

    // Gestione dell'aggiunta al carrello
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userInfo) {
            // Se l'utente non è loggato, reindirizzalo o mostra un messaggio
            // Puoi aggiungere un toast.error qui se lo desideri
            // es: toast.error("Devi effettuare il login per aggiungere prodotti al carrello.");
            console.log("Devi effettuare il login per aggiungere prodotti al carrello.");
            return;
        }

        const productData = {
            productId: product._id,
            quantity: 1,
        };

        dispatch(addToCart(productData));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm group hover:shadow-xl transition-all duration-300 border border-gray-100">
            <Link to={`/products/${product.slug}`}>
                <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                />
            </Link>

            <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                    <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">{product.category}</p>
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{product.name}</h3>

                    <Rating value={product.averageRating} />
                    <SmartPrice product={product} size="md" className="mt-3" />
                </Link>

                {/* Renderizza il bottone solo se l'utente è loggato */}
                {userInfo ? (
                    <CustomButton
                        onClick={handleAddToCart}
                        variant="outline"
                        size="md"
                        className="w-full mt-4 hover:bg-gray-100 transition-colors"
                        icon={FiShoppingCart}
                    >
                        Aggiungi al Carrello
                    </CustomButton>
                ) : (
                    <CustomButton
                        to="/login"
                        variant="outline"
                        size="md"
                        className="w-full mt-4"
                    >
                        Aggiungi al Carrello
                    </CustomButton>
                )}
            </div>
        </div>
    );
};

export default ProductCard;