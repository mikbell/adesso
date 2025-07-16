// src/components/products/ProductCard.jsx
import React from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import CustomButton from '../shared/CustomButton';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discountPercentage}%
                </div>
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
                <div className="flex items-center my-2">
                    <FiStar className="text-yellow-400" />
                    <span className="text-gray-600 text-sm ml-1">{product.rating}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-2xl font-bold text-indigo-600">€{product.discountPrice.toFixed(2)}</p>
                    <p className="text-md text-gray-400 line-through">€{product.originalPrice.toFixed(2)}</p>
                </div>
                <CustomButton variant="outline" size="md" className="w-full mt-4" icon={FiShoppingCart}>
                    Aggiungi al Carrello
                </CustomButton>
            </div>
        </div>
    );
};

export default ProductCard;