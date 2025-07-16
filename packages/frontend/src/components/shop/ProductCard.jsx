import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => (
    <div className="group relative border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
        <Link to={`/product/${product.id}`} className="block aspect-square bg-slate-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </Link>
        <div className="p-4 bg-white">
            <span className="text-xs text-slate-500 mb-1 block">{product.category}</span>
            <h3 className="text-base font-semibold text-slate-800 mb-2 truncate">
                <Link to={`/product/${product.id}`} className="hover:text-blue-600">{product.name}</Link>
            </h3>
            <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>
                <Rating value={product.rating} />
            </div>
        </div>
    </div>
);

export default ProductCard;