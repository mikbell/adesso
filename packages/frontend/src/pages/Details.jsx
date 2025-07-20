import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import {
    LoadingPage,
    CustomButton,
    ProductImageGallery,
    SmartPrice,
    QuantitySelector,
    Breadcrumbs,
    Rating
} from '@adesso/ui-components';

import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { getProductById, clearProductState } from '@adesso/core-logic';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'; // Importa l'icona della freccia


const Details = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();

    const { product, loader, errorMessage } = useSelector(state => state.product);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        dispatch(getProductById(slug));
        return () => dispatch(clearProductState());
    }, [slug, dispatch]);

    useEffect(() => {
        if (errorMessage) toast.error(errorMessage);
    }, [errorMessage]);

    const handleAddToCart = () => {
        // TODO: integrazione logica reale
        console.log(`Aggiunto al carrello: ${quantity} x ${product.name}`);
        toast.success(`${product.name} aggiunto al carrello!`);
    };

    if (loader || !product) return <LoadingPage />;

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-10 md:py-16">
                {/* Posiziona i Breadcrumbs qui, sopra il contenuto principale */}
                <Breadcrumbs product={product} /> {/* Passa il prodotto al componente Breadcrumbs */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Immagini Prodotto */}
                    <ProductImageGallery images={product.images} altText={product.name} />

                    {/* Dettagli Prodotto */}
                    <div className="flex flex-col justify-between">
                        {/* Categoria, Nome e Brand */}
                        <div className="mb-6">
                            {/* Rimosso il link di categoria duplicato qui per coerenza con i breadcrumbs */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">{product.name}</h1>
                            {product.brand && (
                                <p className="text-lg text-gray-500 mt-1">{product.brand}</p>
                            )}

                            <Rating value={product.rating} text="7 recensioni" />
                            <p>Quantità disponibile: {product.stock}</p>
                        </div>

                        {/* Prezzo */}
                        <SmartPrice product={product} size="lg" className="mb-6" />


                        {/* Descrizione */}
                        <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>

                        {/* Quantità e Azioni */}
                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-6 mb-6">
                                <label htmlFor="quantity" className="text-md font-semibold text-gray-800">
                                    Quantità:
                                </label>
                                <QuantitySelector
                                    id="quantity"
                                    quantity={quantity}
                                    onQuantityChange={setQuantity}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <CustomButton
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="w-full"
                                    icon={FiShoppingCart}
                                >
                                    Aggiungi al Carrello
                                </CustomButton>
                                <CustomButton
                                    variant="secondary"
                                    size="lg"
                                    className="w-full"
                                    icon={FiHeart}
                                >
                                    Aggiungi alla Wishlist
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;