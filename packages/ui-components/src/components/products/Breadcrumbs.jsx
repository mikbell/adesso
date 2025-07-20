import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Breadcrumbs = ({ product }) => {
    // Gestisce il caso in cui il prodotto non sia ancora disponibile
    if (!product) return null;

    // Capitalizza la prima lettera di una stringa
    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return (
        <nav className="text-sm font-medium text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center space-x-2">
                <li className="flex items-center">
                    <Link to="/" className="text-gray-600 hover:text-gray-800 hover:underline">
                        Home
                    </Link>
                    <MdOutlineKeyboardArrowRight className="mx-1 text-gray-400" />
                </li>
                <li className="flex items-center">
                    <Link
                        to={`/category/${product.category}`}
                        className="text-gray-600 hover:text-gray-800 hover:underline"
                    >
                        {capitalize(product.category)}
                    </Link>
                    <MdOutlineKeyboardArrowRight className="mx-1 text-gray-400" />
                </li>
                <li className="flex items-center text-gray-800 truncate max-w-xs md:max-w-md">
                    {product.name}
                </li>
            </ol>
        </nav>
    );
};

export default Breadcrumbs;