import React from 'react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import CustomButton from '../shared/CustomButton';
import SmartPrice from '../shared/SmartPrice'; // importa il nuovo componente
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product.slug}`} className="bg-white rounded-2xl shadow-sm group hover:shadow-xl transition-all duration-300 border border-gray-100">
            <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-full h-60 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
            />

            <div className="p-4">
                <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">{product.category}</p>
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{product.name}</h3>

                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <FiStar className="text-yellow-400" />
                    <span>{product.rating}</span>
                </div>

                <SmartPrice product={product} size="md" className="mt-3" />

                <CustomButton
                    variant="outline"
                    size="md"
                    className="w-full mt-4 hover:bg-gray-100 transition-colors"
                    icon={FiShoppingCart}
                >
                    Aggiungi al Carrello
                </CustomButton>
            </div>
        </Link>
    );
};

export default ProductCard;
