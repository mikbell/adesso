import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Importa gli hook Redux
import { getProducts } from '@adesso/core-logic'; // Assicurati che 'getProducts' sia esportato correttamente dal tuo store
import { FiFilter, FiX, FiChevronDown, FiStar } from 'react-icons/fi';
import { Dialog, Disclosure, Menu, MenuButton, MenuItems, MenuItem, DisclosureButton, DisclosurePanel, DialogPanel } from '@headlessui/react';
import { CustomCheckbox, PriceRangeSlider, ProductCard, Rating, CustomInput } from '@adesso/ui-components'

// --- DATI DI ESEMPIO (Rimuoviamo allProducts, useremo Redux) ---
// const allProducts = [ ... ]; // Rimuovi o commenta questa sezione

const categories = ['Tutte', 'Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Accessori'];
const ratings = [5, 4, 3, 2, 1];
const sortOptions = [
    { name: 'Popolarità', value: 'popularity' }, // Questo sarà il default se il backend non ha un ordinamento specifico per 'popularity'
    { name: 'Prezzo: dal più basso', value: 'price-asc' },
    { name: 'Prezzo: dal più alto', value: 'price-desc' },
    { name: 'Valutazione: dalla più alta', value: 'rating-desc' },
];
const MAX_PRICE = 500;


// --- COMPONENTE PRINCIPALE: PAGINA NEGOZIO ---
const Shop = () => {
    const dispatch = useDispatch();
    const { products, totalProducts, loader, errorMessage } = useSelector(state => state.product); // Ottieni i dati dallo store

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    // Non abbiamo più bisogno di filteredProducts come stato locale, lo otteniamo da Redux

    // Stati per i filtri
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['Tutte']);
    const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState(sortOptions[0]); // Mantiene l'oggetto completo
    const [currentPage, setCurrentPage] = useState(1); // Nuovo stato per la paginazione
    const [productsPerPage] = useState(12); // Quantità di prodotti per pagina

    // --- Logica di fetching e gestione eventi ---

    useEffect(() => {
        // Dispatcha il thunk per ottenere i prodotti ogni volta che i filtri cambiano
        dispatch(getProducts({
            page: currentPage,
            perPage: productsPerPage,
            search: searchQuery,
            categories: selectedCategories,
            priceRange: priceRange,
            rating: selectedRating,
            sortBy: sortBy.value, // Passa solo il 'value' dell'opzione di ordinamento
        }));
    }, [dispatch, currentPage, productsPerPage, searchQuery, selectedCategories, priceRange, selectedRating, sortBy]); // Dipendenze aggiornate

    const handleCategoryChange = (category) => {
        setCurrentPage(1); // Reset pagina alla modifica dei filtri
        if (category === 'Tutte') {
            setSelectedCategories(['Tutte']);
        } else {
            setSelectedCategories(prev => {
                const newCats = prev.includes(category) ? prev.filter(c => c !== category) : [...prev.filter(c => c !== 'Tutte'), category];
                return newCats.length === 0 ? ['Tutte'] : newCats;
            });
        }
    };

    const resetFilters = () => {
        setCurrentPage(1); // Reset pagina
        setSearchQuery('');
        setSelectedCategories(['Tutte']);
        setPriceRange([0, MAX_PRICE]);
        setSelectedRating(0);
        setSortBy(sortOptions[0]);
    };

    /**
     * JSX per la sidebar dei filtri, che accede direttamente allo stato del componente App
     */
    const FiltersContent = () => (
        <div className="space-y-6">
            <CustomInput type="text" placeholder="Cerca..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            <Disclosure defaultOpen>
                {({ open }) => (
                    <div>
                        <DisclosureButton className="flex w-full justify-between items-center text-lg font-semibold">Categorie <FiChevronDown className={`${open ? 'rotate-180' : ''} transition-transform`} /></DisclosureButton>
                        <DisclosurePanel className="space-y-2 pt-2">
                            {categories.map(cat => (
                                <CustomCheckbox key={cat} label={cat} checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} />
                            ))}
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
            <Disclosure defaultOpen>
                {({ open }) => (
                    <div>
                        <DisclosureButton className="flex w-full justify-between items-center text-lg font-semibold">Prezzo <FiChevronDown className={`${open ? 'rotate-180' : ''} transition-transform`} /></DisclosureButton>
                        <DisclosurePanel className="pt-4">
                            <PriceRangeSlider min={0} max={MAX_PRICE} value={priceRange} onChange={(value) => { setPriceRange(value); setCurrentPage(1); }} />
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
            <Disclosure defaultOpen>
                {({ open }) => (
                    <div>
                        <DisclosureButton className="flex w-full justify-between items-center text-lg font-semibold">Valutazione <FiChevronDown className={`${open ? 'rotate-180' : ''} transition-transform`} /></DisclosureButton>
                        <DisclosurePanel className="space-y-2 pt-2">
                            {ratings.map(r => (
                                <div key={r} className="flex items-center">
                                    <input id={`rating-${r}`} name="rating" type="radio" checked={selectedRating === r} onChange={() => { setSelectedRating(r); setCurrentPage(1); }} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor={`rating-${r}`} className="ml-3 flex items-center gap-1 text-sm text-slate-600"><Rating value={r} /> e più</label>
                                </div>
                            ))}
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
            <button onClick={resetFilters} className="w-full text-center py-2 bg-slate-200 hover:bg-slate-300 rounded-md font-semibold transition-colors">Resetta Filtri</button>
        </div>
    );

    // --- Render del componente App ---
    return (
        <div className="bg-white font-sans">
            <Dialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} className="relative z-50 lg:hidden">
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex">
                    <DialogPanel className="relative mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-medium">Filtri</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2"><FiX /></button>
                        </div>
                        <div className="mt-4 border-t border-slate-200 px-4 py-6"><FiltersContent /></div>
                    </DialogPanel>
                </div>
            </Dialog>

            <main className="mx-auto w-[90%] py-16">
                <div className="pb-8 border-b border-slate-200">
                    <nav className="text-sm text-slate-500">Home / <b>Negozio</b></nav>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mt-2">Tutti i Prodotti</h1>
                </div>

                <div className="pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
                    <aside className="hidden lg:block"><FiltersContent /></aside>

                    <div className="lg:col-span-3">
                        <div className="flex items-baseline justify-between mb-6">
                            <p className="text-sm text-slate-600">
                                Mostrando <span className="font-bold">{products.length}</span> di <span className="font-bold">{totalProducts}</span> risultati
                            </p>
                            <Menu as="div" className="relative">
                                <MenuButton className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                                    Ordina per: {sortBy.name} <FiChevronDown />
                                </MenuButton>
                                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                        {sortOptions.map(opt => (
                                            <MenuItem key={opt.value}>
                                                <button onClick={() => { setSortBy(opt); setCurrentPage(1); }} className="w-full text-left block px-4 py-2 text-sm text-slate-700 data-[active]:bg-slate-100">{opt.name}</button>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>

                        <div className="lg:hidden mb-4">
                            <button onClick={() => setMobileFiltersOpen(true)} className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 rounded-md font-semibold">
                                <FiFilter /> Filtra e Ordina
                            </button>
                        </div>

                        {loader ? (
                            <p className="sm:col-span-2 xl:col-span-3 text-center text-slate-500 py-10">Caricamento prodotti...</p>
                        ) : errorMessage ? (
                            <p className="sm:col-span-2 xl:col-span-3 text-center text-red-500 py-10">Errore: {errorMessage}</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {products.length > 0 ? (
                                    products.map(product => <ProductCard key={product._id} product={product} />) // Assumi che l'ID sia '_id'
                                ) : (
                                    <p className="sm:col-span-2 xl:col-span-3 text-center text-slate-500 py-10">Nessun prodotto trovato. Prova a modificare i filtri.</p>
                                )}
                            </div>
                        )}

                        {/* TODO: Aggiungere qui la logica e i controlli per la paginazione, utilizzando totalProducts e currentPage/productsPerPage */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Shop;