import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SmartPrice from '../shared/SmartPrice';

// Helper: Chunks an array into smaller arrays of a given size.
const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

// Helper: Renders rating stars.
const Rating = ({ value }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= value) stars.push(<FaStar key={i} className="text-amber-400" />);
        else if (i === Math.ceil(value) && !Number.isInteger(value)) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
        else stars.push(<AiOutlineStar key={i} className="text-slate-300" />);
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};

// Helper: Renders a single product row.
const ProductRow = ({ product }) => (
    <Link to={`/products/${product.slug}`} className="flex items-center gap-4 p-3 transition-colors duration-300 hover:bg-slate-100 group">
        <div className="block shrink-0">
            <img src={product.images[0]?.url} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
        </div>
        <div className="flex-grow">
            <h3 className="text-base font-semibold text-slate-800 truncate group-hover:text-blue-600">
                {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <Rating value={product.averageRating || 0} />
            </div>
            <SmartPrice product={product} className="mt-2" />
        </div>
    </Link >
);

// Helper: Custom buttons for carousel navigation.
const ButtonGroup = ({ next, previous }) => (
    <div className="absolute top-0 right-0 flex items-center gap-2">
        <button onClick={previous} aria-label="Previous" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:bg-slate-100 cursor-pointer">
            <FiChevronLeft size={20} />
        </button>
        <button onClick={next} aria-label="Next" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:bg-slate-100 cursor-pointer">
            <FiChevronRight size={20} />
        </button>
    </div>
);

const responsive = {
    all: { breakpoint: { max: 4000, min: 0 }, items: 1 }
};

/**
 * A "dumb" UI component for displaying products in a vertical list carousel.
 */
const ProductCarousel = ({ title, products = [], isLoading = false }) => {
    // We chunk the products into groups of 3 for the vertical layout.
    const productChunks = chunkArray(products, 3);

    return (
        <div className='w-full py-16 bg-white'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className="relative">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
                    <Carousel
                        responsive={responsive}
                        infinite={true}
                        arrows={false}
                        renderButtonGroupOutside={true}
                        customButtonGroup={<ButtonGroup />}
                    >
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            productChunks.map((chunk, index) => (
                                <div className="grid grid-cols-1 divide-y" key={index}>
                                    {chunk.map(product => (
                                        <ProductRow key={product._id} product={product} />
                                    ))}
                                </div>
                            ))
                        )}
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;