import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import categories from '../data/categories';

// La configurazione 'responsive' per il carosello
const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1600 }, items: 6 },
    desktop: { breakpoint: { max: 1600, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 3 },
    mdmobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
};

// Componente per la singola card di una categoria
const CategoryCard = ({ category }) => (
    <Link to={`/products?category=${category.name}`} className="block group">
        <div className="relative overflow-hidden rounded-lg aspect-square">
            {/* Immagine di sfondo */}
            <img
                src={category.img}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay scuro per leggibilità */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
            {/* Testo della categoria */}
            <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold tracking-wider p-2 text-center">
                    {category.name}
                </h3>
            </div>
        </div>
    </Link>
);


const Categories = () => {
    return (
        <div className='w-full py-12 bg-slate-50'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                {/* Titolo della Sezione */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Esplora per categoria</h2>
                    <p className="text-slate-500 mt-2">Esplora le categorie più popolari</p>
                </div>

                <Carousel
                    responsive={responsive}
                    infinite={true}
                    arrows={true} // Le frecce sono utili per la navigazione manuale
                    showDots={false}
                    containerClass="carousel-container"
                    // Aggiunge un po' di spazio tra gli elementi
                    itemClass="p-2"
                >
                    {categories.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default Categories;
