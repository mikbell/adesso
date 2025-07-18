import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

// Componente "scheletro" per il caricamento
const BannerSkeleton = () => (
    <div className="w-full h-96 bg-gray-300 rounded-lg animate-pulse"></div>
);

/**
 * Un componente UI "dumb" per visualizzare un carosello di banner.
 * Riceve le immagini e lo stato di caricamento come props.
 */
const BannerCarousel = ({ images = [], isLoading = false }) => {
    return (
        <div className='w-full md:mt-6'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className='w-full my-8'>
                    {isLoading ? (
                        <BannerSkeleton />
                    ) : (
                        <Carousel
                            autoPlay={true}
                            infinite={true}
                            responsive={responsive}
                            showDots={true}
                            arrows={true}
                            containerClass="carousel-container rounded-lg overflow-hidden"
                            itemClass="carousel-item"
                        >
                            {images.map((image) => (
                                <Link to="/products" key={image.id}>
                                    <img
                                        src={image.image}
                                        alt={image.text || 'Banner promozionale'}
                                        className='w-full h-auto md:h-96 object-cover'
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BannerCarousel;