import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti e Icone
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import LoadingPage from '../components/shared/LoadingPage';
import CustomButton from '../components/shared/CustomButton';
import ProductImageGallery from '../components/products/ProductImageGallery';
import SmartPrice from '../components/products/SmartPrice';
import QuantitySelector from '../components/products/QuantitySelector';

// Azioni Redux
import { getProductById, clearProductState } from '../store/reducers/productSlice';

const Details = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();

    const { product, loader, errorMessage } = useSelector(state => state.product);
    const [quantity, setQuantity] = useState(1);

    // Carica i dati del prodotto al montaggio e li pulisce all'uscita
    useEffect(() => {
        dispatch(getProductById(productId));
        return () => {
            dispatch(clearProductState());
        };
    }, [productId, dispatch]);

    // Gestisce eventuali errori nel caricamento
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    const handleAddToCart = () => {
        // Logica futura per aggiungere al carrello
        console.log(`Aggiunto al carrello: ${quantity} x ${product.name}`);
        toast.success(`${product.name} aggiunto al carrello!`);
    };

    if (loader || !product) {
        return <LoadingPage />;
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Colonna Sinistra: Galleria Immagini */}
                    <ProductImageGallery images={product.images} altText={product.name} />

                    {/* Colonna Destra: Info e Azioni */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <Link to={`/category/${product.category}`} className="text-sm font-semibold text-indigo-600 hover:underline">
                                {product.category}
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">{product.name}</h1>
                            <p className="text-lg text-gray-500 mt-1">{product.brand}</p>
                        </div>

                        {/* Prezzo */}
                        <div className="my-4">
                            <SmartPrice product={product} size="lg" />
                        </div>

                        {/* Descrizione Breve */}
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="mt-auto pt-6 border-t">
                            {/* Selettore Quantità */}
                            <div className="flex items-center gap-6 mb-6">
                                <label className="text-md font-semibold text-gray-800">Quantità:</label>
                                <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
                            </div>

                            {/* Pulsanti di Azione */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <CustomButton onClick={handleAddToCart} size="lg" className="w-full" icon={<FiShoppingCart />}>
                                    Aggiungi al Carrello
                                </CustomButton>
                                <CustomButton variant="secondary" size="lg" className="w-full" icon={<FiHeart />}>
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