import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import bannerImages from '../data/banner';

// La configurazione 'responsive' può essere definita fuori dal componente
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const Banner = () => {
  return (
    <div className='w-full md:mt-6'>
      <div className='w-[85%] lg:w-[90%] mx-auto'>
        {/* Il contenitore del carosello deve avere una larghezza definita, es. w-full */}
        <div className='w-full my-8'>
          <Carousel
            autoPlay={true}
            infinite={true}
            responsive={responsive}
            showDots={true} // Aggiunti i puntini per una migliore UX
            arrows={true} // Nascoste le frecce, dato che c'è l'autoplay
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {/* Mappatura sui dati */}
            {bannerImages.map((image) => (
              // FIX: Rimosse le classi di larghezza dal Link.
              // Il carosello gestisce la larghezza di ogni item.
              <Link to="/products" key={image.id}>
                {/* FIX: Corretto l'URL dell'immagine e aggiunto un'altezza per evitare "layout shift" */}
                <img
                  src={image.image}
                  alt={image.text}
                  className='w-full h-90 object-cover' // h-auto per mantenere le proporzioni
                />
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Banner;
