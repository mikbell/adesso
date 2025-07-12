import React, { useState, useEffect } from 'react';

const ProductImageGallery = ({ images = [], altText = 'Immagine prodotto' }) => {
    // Stato per tenere traccia dell'immagine principale visualizzata
    const [activeImage, setActiveImage] = useState(images[0]);

    // Aggiorna l'immagine attiva se l'array di immagini cambia
    useEffect(() => {
        setActiveImage(images[0]);
    }, [images]);

    // Se non ci sono immagini, mostra un placeholder
    if (!images || images.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Nessuna immagine disponibile</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            {/* Immagine Principale */}
            <div className="w-full h-96 mb-4 overflow-hidden rounded-lg">
                <img
                    src={activeImage.url}
                    alt={altText}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Griglia di Anteprime */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((image) => (
                    <div
                        key={image.public_id}
                        onClick={() => setActiveImage(image)}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${activeImage.public_id === image.public_id ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <img
                            src={image.url}
                            alt={`Anteprima di ${altText}`}
                            className="w-full h-20 object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImageGallery;