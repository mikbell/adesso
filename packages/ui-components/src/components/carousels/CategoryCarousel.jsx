import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1600 }, items: 8 },
    desktop: { breakpoint: { max: 1600, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
};

// Questa è la card, ora è solo UI
const CategoryCard = ({ category }) => (
    <Link to={`/products?category=${category.slug}`} className="block group text-center">
        <div className="relative overflow-hidden rounded-lg shadow-md aspect-square">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center p-2">
                <h3 className="text-white text-md font-semibold">{category.name}</h3>
            </div>
        </div>
    </Link>
);

// Lo scheletro per il caricamento
const CategorySkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-gray-300 rounded-lg aspect-square"></div>
    </div>
);

// Il componente principale del carosello, ora è "dumb"
const CategoryCarousel = ({ categories = [], isLoading = false }) => {
    return (
        <div className='w-full py-12 md:py-16 bg-slate-50'>
            <div className='w-[90%] mx-auto'>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Esplora per Categoria</h2>
                    <p className="text-slate-500 mt-2">Trova i prodotti che ami, suddivisi per te.</p>
                </div>
                <Carousel responsive={responsive} infinite={true} arrows={true} itemClass="p-2">
                    {isLoading
                        ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
                        : categories.map((cat) => <CategoryCard key={cat._id} category={cat} />)
                    }
                </Carousel>
            </div>
        </div>
    );
};

export default CategoryCarousel;