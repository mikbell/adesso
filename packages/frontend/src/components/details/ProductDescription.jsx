import React from 'react';

const ProductDescription = ({ description }) => {
    return (
        <div className="text-gray-700 leading-relaxed text-base">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Dettagli Prodotto</h3>
            <p>{description}</p>
        </div>
    );
};

export default ProductDescription;