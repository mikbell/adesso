import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1600 },
        items: 6,
    },
    desktop: {
        breakpoint: { max: 1600, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 3,
    }
};

const ProductImageGallery = ({ images = [], altText = 'Immagine prodotto' }) => {
    // Inizializza activeImage in modo sicuro: usa la prima immagine se disponibile, altrimenti null
    const [activeImage, setActiveImage] = useState(images[0] || null);

    // Aggiorna l'immagine attiva quando le immagini prop cambiano (es. caricamento di un nuovo prodotto)
    useEffect(() => {
        // Solo aggiorna se ci sono immagini e l'immagine attiva corrente non è la prima nuova immagine
        if (images.length > 0 && (!activeImage || activeImage.url !== images[0].url)) {
            setActiveImage(images[0]);
        } else if (images.length === 0 && activeImage !== null) {
            // Se non ci sono più immagini, resetta l'immagine attiva
            setActiveImage(null);
        }
    }, [images, activeImage]); // activeImage come dipendenza per evitare loop se già la prima immagine

    // Se non ci sono immagini, mostra un placeholder
    if (!images || images.length === 0 || !activeImage) { // Controllo anche per !activeImage
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center flex items-center justify-center h-96">
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
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
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" // Changed to object-contain for better fit
                />
            </div>

            {/* Carousel di Anteprime */}
            {/* Aggiunto un wrapper per il carousel per un migliore controllo dello styling */}
            <div className="thumbnail-carousel-wrapper px-2"> {/* Aggiunto padding per frecce se abilitate */}
                <Carousel
                    responsive={responsive}
                    infinite={false}
                    arrows={true}
                    containerClass="carousel-container"
                    itemClass="carousel-item-padding-40-px"
                >
                    {
                        images.map((image) => (
                            <div
                                key={image.public_id || image.url} // Usa public_id come key se disponibile, altrimenti url
                                className={`cursor-pointer border-2 p-1 rounded-lg transition-all duration-200 ${activeImage && activeImage.url === image.url ? 'border-indigo-600' : 'border-transparent'
                                    }`}
                                onClick={() => setActiveImage(image)}
                            >
                                <img
                                    src={image.url}
                                    alt={altText} // Considera alt più specifico se i dati lo permettono
                                    className="w-full h-24 object-cover rounded-md"
                                />
                            </div>
                        ))
                    }
                </Carousel>
            </div>
        </div>
    );
};

export default ProductImageGallery;