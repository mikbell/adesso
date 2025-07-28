// src/pages/Home.jsx

import React from 'react';

import Banner from '../features/banner/Banner';
import CategorySection from '../features/categories/CategorySection';
import FeaturedProducts from '../features/products/FeaturedProducts';
import Products from '../features/products/Products';

const Home = () => {
    return (
        <div className="w-full">
            <Banner />
            <CategorySection />
            <FeaturedProducts />

            <div className='w-[85%] lg:w-[90%] mx-auto py-10'>
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
                    Ultimi Arrivi
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Products type="latest" limit={9} customTitle='Ultimi Arrivi'/>
                    <Products type="discounted" limit={9} customTitle='Prodotti in Sconto'/>
                    <Products type="topRated" limit={9} minReviews={5} customTitle='Prodotti Popolari'/>
                </div>
            </div>
        </div>
    );
};

export default Home;