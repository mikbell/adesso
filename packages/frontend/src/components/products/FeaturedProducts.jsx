import React from 'react';
import ProductCard from './ProductCard';
import { featuredProducts } from '../../data/products';

const FeaturedProducts = () => {
  return (
    <div className='w-full py-16'>
      <div className='w-[85%] lg:w-[90%] mx-auto'>
        {/* Titolo della Sezione */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Prodotti in Evidenza</h2>
          <p className="text-slate-500 mt-2">Scopri le nostre migliori offerte e i prodotti più amati.</p>
        </div>

        {/* Griglia dei Prodotti */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
