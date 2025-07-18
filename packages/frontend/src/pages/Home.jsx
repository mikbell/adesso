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
                <Products />
            </div>
        </div>
    );
};

export default Home;