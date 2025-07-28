// src/pages/Shop.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '@adesso/core-logic';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { Dialog, Disclosure, Menu, MenuButton, MenuItems, MenuItem, DialogPanel } from '@headlessui/react';
import { ProductCard, ShopPagination } from '@adesso/ui-components';
import { FiltersContent } from '@adesso/ui-components'; // Importa FiltersContent
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

// Rimuovi queste costanti da qui, poiché sono ora in FiltersContent (o assicurati che siano globalmente accessibili se usate altrove)
// const ratings = [5, 4, 3, 2, 1];
const sortOptions = [
    { name: 'Popolarità', value: 'popularity' },
    { name: 'Prezzo: dal più basso', value: 'price-asc' },
    { name: 'Prezzo: dal più alto', value: 'price-desc' },
    { name: 'Valutazione: dalla più alta', value: 'rating-desc' },
];
const MAX_PRICE = 500;
const PRODUCTS_PER_PAGE = 12;

const Shop = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { products, totalProducts, loader, errorMessage } = useSelector(state => state.product);
    const { categories, loader: categoriesLoader, errorMessage: categoriesError } = useSelector(state => state.category);

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['Tutte']);
    const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

    // Effetto per leggere i parametri URL all'avvio o al cambio dell'URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlSearch = params.get('search') || '';
        const urlCategory = params.get('category');

        setSearchQuery(urlSearch);
        if (urlCategory) {
            setSelectedCategories([urlCategory]);
        } else {
            setSelectedCategories(['Tutte']);
        }
        setCurrentPage(1);
    }, [location.search]);

    // Quando i filtri cambiano, dispatcha l'azione per ottenere i prodotti
    useEffect(() => {
        const params = {
            page: currentPage,
            perPage: PRODUCTS_PER_PAGE,
            search: searchQuery,
            categories: selectedCategories.includes('Tutte') ? [] : selectedCategories,
            priceRange: priceRange,
            rating: selectedRating,
            sortBy: sortBy.value,
            showDiscountedOnly: showDiscountedOnly,
        };
        console.log("Shop.jsx: Chiamando getProducts con i parametri:", params);
        dispatch(getProducts(params));
    }, [dispatch, currentPage, searchQuery, selectedCategories, priceRange, selectedRating, sortBy, showDiscountedOnly]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
        if (categoriesError) {
            toast.error(categoriesError);
        }
    }, [errorMessage, categoriesError]);

    const handleCategoryChange = useCallback((category) => {
        setCurrentPage(1);
        if (category === 'Tutte') {
            setSelectedCategories(['Tutte']);
        } else {
            setSelectedCategories(prev => {
                const newCats = prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev.filter(c => c !== 'Tutte'), category];
                return newCats.length === 0 ? ['Tutte'] : newCats;
            });
        }
    }, []); // Non ha dipendenze complesse

    const resetFilters = useCallback(() => {
        setCurrentPage(1);
        setSearchQuery('');
        setSelectedCategories(['Tutte']);
        setPriceRange([0, MAX_PRICE]);
        setSelectedRating(0);
        setSortBy(sortOptions[0]);
        setShowDiscountedOnly(false);
    }, []);

    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    const goToNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    }, [currentPage, totalPages]);

    const goToPrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    }, [currentPage]);

    const goToPage = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    }, []);

    const displayCategories = useMemo(() => ['Tutte', ...categories.map(cat => cat.name)], [categories]);

    // Funzione per generare i numeri di pagina da mostrare
    const getPaginationRange = useMemo(() => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }
        range.push(totalPages);

        const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

        uniqueRange.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
        <div className="bg-gray-50 font-sans min-h-screen">
            <Dialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} className="relative z-50 lg:hidden">
                <div className="fixed inset-0 bg-black/40 transition-opacity data-[closed]:opacity-0" />
                <div className="fixed inset-0 flex">
                    <DialogPanel className="relative mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-gray-50 py-4 pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-2xl font-bold text-gray-900">Filtri</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900"><FiX size={24} /></button>
                        </div>
                        <div className="mt-6 px-4 py-6">
                            {/* Utilizza il componente FiltersContent */}
                            <FiltersContent
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedCategories={selectedCategories}
                                handleCategoryChange={handleCategoryChange}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                selectedRating={selectedRating}
                                setSelectedRating={setSelectedRating}
                                showDiscountedOnly={showDiscountedOnly}
                                setShowDiscountedOnly={setShowDiscountedOnly}
                                displayCategories={displayCategories}
                                resetFilters={resetFilters}
                                categoriesLoader={categoriesLoader}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="pb-8 border-b border-gray-200">
                    <nav className="text-sm text-gray-500">Home / <b className="text-gray-700">Negozio</b></nav>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mt-2">Tutti i Prodotti</h1>
                </div>

                <div className="pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
                    <aside className="hidden lg:block">
                        {/* Utilizza il componente FiltersContent */}
                        <FiltersContent
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategories={selectedCategories}
                            handleCategoryChange={handleCategoryChange}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            selectedRating={selectedRating}
                            setSelectedRating={setSelectedRating}
                            showDiscountedOnly={showDiscountedOnly}
                            setShowDiscountedOnly={setShowDiscountedOnly}
                            displayCategories={displayCategories}
                            resetFilters={resetFilters}
                            categoriesLoader={categoriesLoader}
                        />
                    </aside>

                    <div className="lg:col-span-3">
                        <div className="flex items-baseline justify-between mb-6">
                            <p className="text-sm text-gray-600">
                                Mostrando <span className="font-bold">{products.length}</span> di <span className="font-bold">{totalProducts}</span> risultati
                            </p>
                            <Menu as="div" className="relative">
                                <MenuButton className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors">
                                    Ordina per: <span className="font-semibold">{sortBy.name}</span> <FiChevronDown className="ml-1" />
                                </MenuButton>
                                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-1">
                                    {sortOptions.map(opt => (
                                        <MenuItem key={opt.value}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => { setSortBy(opt); setCurrentPage(1); }}
                                                    className={`w-full text-left block px-4 py-2 text-sm rounded-md ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                                >
                                                    {opt.name}
                                                </button>
                                            )}
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Menu>
                        </div>

                        <div className="lg:hidden mb-6">
                            <button onClick={() => setMobileFiltersOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors">
                                <FiFilter size={20} /> Filtra e Ordina
                            </button>
                        </div>

                        {loader ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                        <div className="w-full h-48 bg-gray-200"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : errorMessage ? (
                            <p className="sm:col-span-2 xl:col-span-3 text-center text-red-500 py-10 text-lg">Errore durante il caricamento dei prodotti: {errorMessage}</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {products.length > 0 ? (
                                    products.map(product => <ProductCard key={product._id} product={product} />)
                                ) : (
                                    <p className="sm:col-span-2 xl:col-span-3 text-center text-gray-500 py-10 text-lg">Nessun prodotto trovato con i filtri selezionati. Prova a modificare i criteri di ricerca.</p>
                                )}
                            </div>
                        )}

                        {/* Pagination Section */}
                        {totalPages > 1 && (
                            <ShopPagination currentPage={currentPage} totalPages={totalPages} goToPrevPage={goToPrevPage} goToNextPage={goToNextPage} goToPage={goToPage} loader={loader} getPaginationRange={getPaginationRange} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Shop;