import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// -> Import the action from your core logic library
import { getProducts } from '@adesso/core-logic';
// -> Import the UI component from your UI library
import { ProductCarousel } from '@adesso/ui-components';

const Products = () => {
    const dispatch = useDispatch();

    // This "smart" component gets the data from Redux.
    const { products, loader } = useSelector((state) => state.product);

    useEffect(() => {
        // Fetch the latest products (e.g., first 9 for 3 slides)
        dispatch(getProducts({ page: 1, perPage: 9, search: '' }));
    }, [dispatch]);

    // It passes the data down to the "dumb" component for rendering.
    return (
        <ProductCarousel
            title="Latest Products"
            products={products}
            isLoading={loader}
        />
    );
};

export default Products;