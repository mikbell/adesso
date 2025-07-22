import React from 'react';
import { Link } from 'react-router-dom';
import {
    CustomButton,
    ProductImageGallery,
    SmartPrice,
    QuantitySelector,
    Rating // Importa Rating se usato qui
} from '@adesso/ui-components';

import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductDetails = ({
    product,
    stockStatusText,
    stockStatusClasses,
    quantity,
    setQuantity,
    handleAddToCart,
}) => {
    if (!product) return null; // Dovrebbe essere gestito dal componente padre, ma per sicurezza

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
            {/* Immagini Prodotto */}
            <div className="flex justify-center items-start">
                <ProductImageGallery images={product.images} altText={product.name} />
            </div>

            {/* Dettagli Prodotto */}
            <div className="flex flex-col">
                <div className="mb-6 pb-6 border-b border-gray-200">
                    {product.category && (
                        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                            <Link to={`/products?category=${product.category.slug}`} className="hover:underline">
                                {product.category.name}
                            </Link>
                        </p>
                    )}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-2">{product.name}</h1>
                    {product.brand && (
                        <p className="text-lg text-gray-600 mt-2">{product.brand}</p>
                    )}

                    <div className="flex items-center mt-3 gap-2">
                        <Rating value={product.rating} />
                        <span className="text-gray-600 text-sm">({product.numReviews} recensioni)</span>
                    </div>
                    <p className={`mt-2 font-medium ${stockStatusClasses}`}>
                        {stockStatusText}
                    </p>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                    <SmartPrice product={product} size="xl" className="font-bold text-gray-900" />
                </div>

                {/* NOTA: la descrizione è stata spostata nel componente Tabs/ProductDescription */}
                {/* <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p> */}

                <div className="mt-auto pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-6 mb-6">
                        <label htmlFor="quantity" className="text-lg font-semibold text-gray-800">
                            Quantità:
                        </label>
                        <QuantitySelector
                            id="quantity"
                            quantity={quantity}
                            onQuantityChange={setQuantity}
                            maxQuantity={product.stock}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <CustomButton
                            onClick={handleAddToCart}
                            size="lg"
                            className="w-full py-3 text-lg"
                            icon={FiShoppingCart}
                            disabled={product.stock === 0}
                        >
                            Aggiungi al Carrello
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            size="lg"
                            className="w-full py-3 text-lg"
                            icon={FiHeart}
                        >
                            Aggiungi alla Wishlist
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;