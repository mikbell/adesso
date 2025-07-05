import React, { useState } from 'react';
import clsx from 'clsx';

const ProductImageGallery = ({ images, altText }) => {
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
                <img src={mainImage} alt={altText} className="w-full h-80 object-cover rounded-lg" />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                    <button key={index} onClick={() => setMainImage(img)}>
                        <img
                            src={img}
                            alt={`${altText} thumbnail ${index + 1}`}
                            className={clsx(
                                'w-full h-20 object-cover rounded-md cursor-pointer ring-2 transition',
                                mainImage === img ? 'ring-indigo-500' : 'ring-transparent hover:ring-indigo-300'
                            )}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductImageGallery;