import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const QuantitySelector = ({ quantity, onQuantityChange }) => {
    const increment = () => onQuantityChange(quantity + 1);
    const decrement = () => onQuantityChange(Math.max(1, quantity - 1)); // Non scende sotto 1

    return (
        <div className="flex items-center border border-gray-300 rounded-lg">
            <button onClick={decrement} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition">-</button>
            <span className="px-5 py-2 font-semibold text-gray-900">{quantity}</span>
            <button onClick={increment} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition">+</button>
        </div>
    );
};

export default QuantitySelector;