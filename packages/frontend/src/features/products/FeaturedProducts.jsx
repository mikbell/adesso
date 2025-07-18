import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// -> Importa l'azione da core-logic
import { getProducts } from '@adesso/core-logic';
// -> Importa il componente UI da ui-components
import { ProductGrid } from '@adesso/ui-components';

const FeaturedProducts = () => {
  const dispatch = useDispatch();

  // Questo componente "smart" parla con Redux
  const { products, loader } = useSelector((state) => state.product);

  useEffect(() => {
    // Carica i prodotti (es. i primi 4, senza filtri)
    dispatch(getProducts({ page: 1, perPage: 4, search: '' }));
  }, [dispatch]);

  // Passa i dati e lo stato di caricamento al componente "dumb"
  return (
    <ProductGrid
      title="Prodotti in Evidenza"
      subtitle="Scopri le nostre migliori offerte e i prodotti più amati."
      products={products}
      isLoading={loader}
    />
  );
};

export default FeaturedProducts;