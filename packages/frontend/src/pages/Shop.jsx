import React, { useState, useEffect } from 'react';
import { FiFilter, FiX, FiChevronDown, FiStar } from 'react-icons/fi';
import { Dialog, Disclosure, Menu, MenuButton, MenuItems, MenuItem, DisclosureButton, DisclosurePanel, DialogPanel } from '@headlessui/react';
import {PriceRangeSlider, ProductCard, Rating} from '@adesso/ui-components'

// --- DATI DI ESEMPIO (In un'app reale, proverrebbero da un'API) ---
const allProducts = [
    { id: 1, name: 'Cuffie Wireless Pro', category: 'Elettronica', price: 199.99, rating: 4.5, image: 'https://placehold.co/600x600/3B82F6/FFFFFF?text=Cuffie' },
    { id: 2, name: 'T-Shirt in Cotone', category: 'Abbigliamento', price: 29.99, rating: 4.0, image: 'https://placehold.co/600x600/10B981/FFFFFF?text=T-Shirt' },
    { id: 3, name: 'Lampada da Tavolo LED', category: 'Casa', price: 79.99, rating: 5.0, image: 'https://placehold.co/600x600/F59E0B/FFFFFF?text=Lampada' },
    { id: 4, name: 'Sneakers da Corsa', category: 'Sport', price: 120.00, rating: 4.5, image: 'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Scarpe' },
    { id: 5, name: 'Smartwatch Serie 8', category: 'Elettronica', price: 499.00, rating: 5.0, image: 'https://placehold.co/600x600/3B82F6/FFFFFF?text=Watch' },
    { id: 6, name: 'Zaino da Viaggio', category: 'Accessori', price: 89.90, rating: 4.5, image: 'https://placehold.co/600x600/10B981/FFFFFF?text=Zaino' },
    { id: 7, name: 'Macchina per Caffè', category: 'Casa', price: 129.50, rating: 4.0, image: 'https://placehold.co/600x600/F59E0B/FFFFFF?text=Caffè' },
    { id: 8, name: 'Mouse Gaming RGB', category: 'Elettronica', price: 65.00, rating: 3.5, image: 'https://placehold.co/600x600/EF4444/FFFFFF?text=Mouse' },
];

const categories = ['Tutte', 'Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Accessori'];
const ratings = [5, 4, 3, 2, 1];
const sortOptions = [
    { name: 'Popolarità', value: 'popularity' },
    { name: 'Prezzo: dal più basso', value: 'price-asc' },
    { name: 'Prezzo: dal più alto', value: 'price-desc' },
    { name: 'Valutazione: dalla più alta', value: 'rating-desc' },
];
const MAX_PRICE = 500;


// --- COMPONENTE PRINCIPALE: PAGINA NEGOZIO ---
const Shop = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(allProducts);

    // Stati per i filtri
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['Tutte']);
    const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState(sortOptions[0]);


    // --- Logica di filtraggio e gestione eventi ---

    useEffect(() => {
        let products = [...allProducts];
        if (searchQuery) products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (!selectedCategories.includes('Tutte')) products = products.filter(p => selectedCategories.includes(p.category));
        products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (selectedRating > 0) products = products.filter(p => p.rating >= selectedRating);
        switch (sortBy.value) {
            case 'price-asc': products.sort((a, b) => a.price - b.price); break;
            case 'price-desc': products.sort((a, b) => b.price - a.price); break;
            case 'rating-desc': products.sort((a, b) => b.rating - a.rating); break;
            default: break;
        }
        setFilteredProducts(products);
    }, [searchQuery, selectedCategories, priceRange, selectedRating, sortBy]);

    const handleCategoryChange = (category) => {
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
            <div>
                <h3 className="text-lg font-semibold mb-3">Cerca</h3>
                <input type="text" placeholder="Nome prodotto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <Disclosure defaultOpen>
                {({ open }) => (
                    <div>
                        <DisclosureButton className="flex w-full justify-between items-center text-lg font-semibold">Categorie <FiChevronDown className={`${open ? 'rotate-180' : ''} transition-transform`} /></DisclosureButton>
                        <DisclosurePanel className="space-y-2 pt-2">
                            {categories.map(cat => (
                                <div key={cat} className="flex items-center">
                                    <input id={`cat-${cat}`} type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor={`cat-${cat}`} className="ml-3 text-sm text-slate-600">{cat}</label>
                                </div>
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
                            <PriceRangeSlider min={0} max={MAX_PRICE} value={priceRange} onChange={setPriceRange} />
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
                                    <input id={`rating-${r}`} name="rating" type="radio" checked={selectedRating === r} onChange={() => setSelectedRating(r)} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
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
                                Mostrando <span className="font-bold">{filteredProducts.length}</span> di <span className="font-bold">{allProducts.length}</span> risultati
                            </p>
                            <Menu as="div" className="relative">
                                <MenuButton className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                                    Ordina per: {sortBy.name} <FiChevronDown />
                                </MenuButton>
                                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                        {sortOptions.map(opt => (
                                            <MenuItem key={opt.value}>
                                                <button onClick={() => setSortBy(opt)} className="w-full text-left block px-4 py-2 text-sm text-slate-700 data-[active]:bg-slate-100">{opt.name}</button>
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

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => <ProductCard key={product.id} product={product} />)
                            ) : (
                                <p className="sm:col-span-2 xl:col-span-3 text-center text-slate-500 py-10">Nessun prodotto trovato. Prova a modificare i filtri.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Shop;
