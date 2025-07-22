import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1600 }, items: 6 },
    desktop: { breakpoint: { max: 1600, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 4 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 3 },
};

const ProductImageGallery = ({ images = [], altText = 'Immagine prodotto' }) => {
    const [activeImage, setActiveImage] = React.useState(images[0] || null);

    React.useEffect(() => {
        if (!images.length) {
            setActiveImage(null);
        } else if (!images.some(img => img.url === activeImage?.url)) {
            setActiveImage(images[0]);
        }
    }, [images]);

    if (!activeImage) {
        return (
            <div className="bg-white p-6 rounded-lg shadow text-center flex items-center justify-center h-96">
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Nessuna immagine disponibile</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Immagine Principale */}
            <div className="w-full h-96 bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
                <img
                    src={activeImage.url}
                    alt={altText}
                    className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                />
            </div>

            {/* Carousel Thumbnail */}
            <Carousel
                responsive={responsive}
                infinite={true}
                arrows={true}
                itemClass="p-2"
                containerClass="w-full"
            >
                {images.map((img) => {
                    const isActive = activeImage?.url === img.url;
                    return (
                        <div
                            key={img.public_id || img.url}
                            role="button"
                            onClick={() => setActiveImage(img)}
                            className={`rounded-lg overflow-hidden border-2 aspect-square w-full cursor-pointer group
                                ${isActive ? 'border-indigo-600' : 'border-transparent hover:border-indigo-400'}
                            `}
                        >
                            <img
                                src={img.url}
                                alt={altText}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default ProductImageGallery;
