import React from 'react';

/**
 * Un componente "intelligente" per visualizzare il prezzo di un prodotto.
 * Calcola automaticamente il prezzo finale se è presente uno sconto
 * e mostra un layout chiaro con il prezzo originale barrato.
 *
 * @param {object} props - Le props del componente.
 * @param {object} props.product - L'oggetto prodotto, deve contenere 'price' e 'discount'.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - La dimensione del testo per adattarsi a contesti diversi.
 * @param {string} [props.className] - Classi CSS aggiuntive per personalizzare il contenitore.
 */
const SmartPrice = ({ product, size = 'md', className = '' }) => {
    // 1. Logica interna per determinare se c'è uno sconto e calcolare il prezzo finale.
    const hasDiscount = product && product.discount > 0;
    const finalPrice = hasDiscount
        ? product.price - (product.price * product.discount / 100)
        : product.price;

    // 2. Stili dinamici per la dimensione del testo.
    const sizeStyles = {
        sm: { price: 'text-lg', oldPrice: 'text-sm' },
        md: { price: 'text-xl', oldPrice: 'text-base' },
        lg: { price: 'text-2xl', oldPrice: 'text-lg' },
    };
    const styles = sizeStyles[size] || sizeStyles.md;

    return (
        <div className={`flex items-baseline gap-3 ${className}`}>
            {/* Prezzo finale, sempre visibile e in evidenza */}
            <span className={`font-bold text-gray-900 ${styles.price}`}>
                €{finalPrice.toFixed(2)}
            </span>

            {/* Se c'è uno sconto, mostra anche il prezzo originale e il badge */}
            {hasDiscount && (
                <>
                    <span className={`text-gray-400 line-through ${styles.oldPrice}`}>
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