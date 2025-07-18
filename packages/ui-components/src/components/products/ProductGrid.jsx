import ProductCard from './ProductCard';

// Componente "scheletro" per il caricamento
const GridSkeleton = () => (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-56 rounded-t-lg"></div>
                <div className="p-4 bg-gray-200 rounded-b-lg space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);


/**
 * Un componente UI "dumb" per visualizzare una griglia di prodotti in evidenza.
 * Riceve i prodotti e lo stato di caricamento come props.
 */
const ProductGrid = ({ title, subtitle, products = [], isLoading = false }) => {
    return (
        <div className='w-full py-16'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                {/* Titolo della Sezione */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">{title}</h2>
                    <p className="text-slate-500 mt-2">{subtitle}</p>
                </div>

                {/* Griglia dei Prodotti o Scheletro di Caricamento */}
                {isLoading ? (
                    <GridSkeleton />
                ) : (
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;