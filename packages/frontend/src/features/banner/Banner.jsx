import React, { useState, useEffect } from 'react';

// -> Importa il componente UI dalla tua libreria condivisa
import { BannerCarousel } from '@adesso/ui-components';
// -> Per ora, importiamo i dati statici. In futuro, potresti usare un thunk Redux qui.
import bannerImages from '../../data/banner';

const Banner = () => {
  // Stato per gestire il caricamento (simulato)
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula il caricamento dei dati da un'API
  useEffect(() => {
    setLoading(true);
    // Simula un ritardo di rete
    const timer = setTimeout(() => {
      setImages(bannerImages);
      setLoading(false);
    }, 500); // Ritardo di 0.5 secondi

    return () => clearTimeout(timer);
  }, []);

  // Passa i dati e lo stato di caricamento al componente "dumb"
  return (
    <BannerCarousel images={images} isLoading={loading} />
  );
};

export default Banner;