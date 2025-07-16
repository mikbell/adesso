import React from 'react'
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import Rating from './Rating';

const ProductCard = ({ product }) => (
    <div className="group relative border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Sezione Immagine e Azioni */}
        <div className="relative bg-slate-100">
            <Link to={`/product/${product.id}`} className="block aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </Link>
            {/* Badge (es. Sconto, Nuovo) */}
            {product.badge && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {product.badge}
                </span>
            )}
            {/* Pulsanti di Azione (visibili su hover) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all">
                    <FiShoppingCart />
                </button>
                <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all">
                    <FiHeart />
                </button>
                <button aria-label="Vai al prodotto" to={`/product/${product.id}`} className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all">
                    <FiEye />
                </button>
            </div>
        </div>
        {/* Sezione Dettagli Prodotto */}
        <div className="p-4 bg-white">
            <span className="text-xs text-slate-500 mb-1 block">{product.category}</span>
            <h3 className="text-base font-semibold text-slate-800 mb-2 truncate">
                <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
                    {product.name}
                </Link>
            </h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-blue-600">
                        ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                    </p>
                    {product.discountPrice && (
                        <p className="text-sm text-slate-400 line-through">
                            ${product.price.toFixed(2)}
                        </p>
                    )}
                </div>
                <Rating value={product.rating} />
            </div>
        </div>
    </div>
);

export default ProductCard