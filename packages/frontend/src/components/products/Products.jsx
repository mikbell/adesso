import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';

// Importa le icone
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { products } from '../../data/products';

// Funzione di utilità per dividere l'array in blocchi di 3
const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

// Componente per le stelle di valutazione
const Rating = ({ value }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= value) stars.push(<FaStar key={i} className="text-amber-400" />);
        else if (i === Math.ceil(value) && !Number.isInteger(value)) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
        else stars.push(<AiOutlineStar key={i} className="text-slate-300" />);
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};

// Componente per la singola riga di un prodotto
const ProductRow = ({ product }) => (
    <div className="flex items-center gap-4 p-3 transition-colors duration-300 rounded-lg hover:bg-slate-100">
        <Link to={`/product/${product.id}`} className="block shrink-0">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
        </Link>
        <div className="flex-grow">
            <h3 className="text-base font-semibold text-slate-800 truncate">
                <Link to={`/product/${product.id}`} className="hover:text-blue-600">{product.name}</Link>
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <Rating value={product.rating} />
                <span className="text-xs text-slate-400">({product.rating.toFixed(1)})</span>
            </div>
            <p className="text-md font-bold text-blue-600 mt-1">${product.price.toFixed(2)}</p>
        </div>
    </div>
);

// Componente per i pulsanti di controllo del carosello
const ButtonGroup = ({ next, previous }) => {
    return (
        <div className="absolute top-8 right-0 flex items-center gap-2">
            <button onClick={previous} aria-label="Vai al prodotto precedente" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
                <FiChevronLeft size={20} />
            </button>
            <button onClick={next} aria-label="Vai al prodotto successivo" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
                <FiChevronRight size={20} />
            </button>
        </div>
    );
};

// Configurazione responsive del carosello
const responsive = {
    all: {
        breakpoint: { max: 4000, min: 0 },
        items: 1
    }
};

const LatestProducts = () => {
    // Raggruppa i prodotti in blocchi di 3
    const productChunks = chunkArray(products, 3);

    return (
        <div className='w-full py-16 bg-white'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className="relative">
                    <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={false}
                        showDots={false}
                        containerClass="carousel-container"
                        dotListClass="custom-dot-list-style"
                        renderButtonGroupOutside={true}
                        customButtonGroup={<ButtonGroup />}
                    >
                        {/* Mappa sui blocchi di prodotti */}
                        {productChunks.map((chunk, index) => (
                            <div className="grid grid-cols-1 divide-y divide-slate-200" key={index}>
                                {/* Mappa sui 3 prodotti del blocco */}
                                {chunk.map(product => (
                                    <ProductRow key={product.id} product={product} />
                                ))}
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

export default LatestProducts;
