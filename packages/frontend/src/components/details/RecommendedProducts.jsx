// components/RecommendedProducts.jsx
import React from 'react';
// Assicurati che Rating e SmartPrice siano correttamente importati o definiti nel tuo progetto.
// Se vengono da @adesso/ui-components, va bene. Altrimenti, potresti aver bisogno di mockarli.
// Esempio di mock per Rating se non hai @adesso/ui-components
const Rating = ({ rating }) => {
    // Implementazione semplificata per mostrare le stelle
    return (
        <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

// Esempio di mock per SmartPrice se non hai @adesso/ui-components
const SmartPrice = ({ product }) => {
    return (
        <p className="text-gray-700 font-bold mb-3">€{product.price.toFixed(2)}</p>
    );
};


import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'; // Importa gli stili del carosello

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 1200 },
        items: 4,
        slidesToSlide: 2, // optional, default to 1.
    },
    desktop: {
        breakpoint: { max: 1200, min: 992 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 992, min: 640 },
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

const RecommendedProducts = ({ products }) => {
    if (!products || products.length === 0) {
        return null; // Non mostra la sezione se non ci sono prodotti consigliati
    }

    return (
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 lg:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Potrebbe Interessarti Anche</h2>
            <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={false} // Disabilita l'autoplay per un maggiore controllo utente
                keyBoardControl={true}
                customTransition="all .5s ease-in-out" // Transizione più fluida
                transitionDuration={500}
                containerClass="carousel-container pb-12" // Aggiunge padding per i dots
                removeArrowOnDeviceType={["tablet", "mobile"]} // Rimuove frecce su tablet e mobile
                deviceType={"desktop"} // Questo è un placeholder, il valore reale dovrebbe essere determinato dinamicamente
                dotListClass="custom-dot-list-style" // Classe per personalizzare i dots (vedi CSS sotto)
                itemClass="carousel-item-padding-40-px px-2" // Padding tra gli item per le card
            >
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center h-full mx-auto transition-shadow hover:shadow-md">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                        {/* Assicurati che product.rating sia un numero */}
                        {product.rating !== undefined && <Rating rating={product.rating} />}
                        <SmartPrice product={product} />
                        <button className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                            Vedi Dettagli
                        </button>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default RecommendedProducts;