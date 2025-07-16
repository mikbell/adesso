import React from 'react';

const SmartPrice = ({ product, className = '' }) => {
    // Logica interna per pulizia e riuso
    const hasDiscount = product.discount && product.discount > 0;
    const finalPrice = hasDiscount
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    return (
        <div className={`flex items-baseline gap-2 ${className}`}>
            {/* Prezzo finale, sempre visibile e in evidenza */}
            <span className="font-bold text-xl text-gray-900">
                €{finalPrice.toFixed(2)}
            </span>

            {/* Se c'è sconto, mostra il prezzo originale e il badge */}
            {hasDiscount && (
                <>
                    <span className="text-md text-gray-400 line-through">
                        €{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                        -{product.discount}%
                    </span>
                </>
            )}
        </div>
    );
};

export default SmartPrice;