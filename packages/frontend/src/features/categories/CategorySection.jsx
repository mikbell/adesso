import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// -> Importa l'azione da core-logic
import { getCategories } from '@adesso/core-logic';
// -> Importa il componente UI da ui-components
import { CategoryCarousel } from '@adesso/ui-components';

const CategorySection = () => {
    const dispatch = useDispatch();
    
    // Questo componente "smart" parla con Redux
    const { categories, loader } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(getCategories({ page: 1, perPage: 12, search: '' }));
    }, [dispatch]);

    // Passa i dati al componente "dumb" che si occupa solo di visualizzare
    return (
        <CategoryCarousel categories={categories} isLoading={loader} />
    );
};

export default CategorySection;