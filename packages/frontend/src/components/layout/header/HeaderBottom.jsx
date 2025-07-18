import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// Importa i componenti necessari da Headless UI
import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogTitle, DialogPanel } from '@headlessui/react';

// Importa le icone
import { HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi2';
import { IoIosSearch } from 'react-icons/io';
import { FiMenu, FiX } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';

// --- Dati di Configurazione (facili da aggiornare) ---

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Negozio', path: '/shop' },
    { name: 'Blog', path: '/blog' },
    { name: 'Chi Siamo', path: '/about' },
    { name: 'Contatti', path: '/contact' },
];

const categories = ['Tutte', 'Elettronica', 'Abbigliamento', 'Casa e Cucina', 'Libri', 'Sport'];

// --- Componente Principale ---

const HeaderBottom = () => {
    // Stato per la gestione del menu mobile (Dialog)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Stati per la barra di ricerca
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

    // Dati di esempio (in un'app reale proverrebbero da uno stato globale)
    const wishlistItemCount = 3;
    const cartItemCount = 5;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // In un'app reale, qui si eseguirebbe la ricerca
        alert(`Ricerca per "${searchQuery}" nella categoria "${selectedCategory}"`);
    };

    // Stile per i link di navigazione attivi
    const activeLinkStyle = {
        color: '#2563EB', // Corrisponde a 'text-blue-600' di Tailwind
        fontWeight: '600',
    };

    return (
        <header className="w-full bg-white shadow-md sticky top-0 z-50">
            <div className="w-[90%] mx-auto flex items-center justify-between h-20">

                {/* --- Sezione Sinistra: Logo e Navigazione Desktop --- */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="text-3xl font-bold text-slate-800">
                        Adesso
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className="text-slate-600 font-medium hover:text-blue-600 transition-colors duration-300"
                                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* --- Sezione Destra: Ricerca e Azioni Desktop --- */}
                <div className="hidden lg:flex items-center gap-6">
                    {/* Barra di Ricerca con Categorie */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-300"
                    >
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center gap-1 pl-4 pr-2 h-11 text-sm text-slate-600">
                                {selectedCategory.substring(0, 10) + (selectedCategory.length > 10 ? '...' : '')}
                                <MdKeyboardArrowDown className="transition-transform data-[open]:rotate-180" />
                            </MenuButton>
                            <MenuItems
                                anchor="bottom start"
                                className="w-48 origin-top-left rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50"
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat}>
                                        <button type="button" onClick={() => setSelectedCategory(cat)} className="w-full text-left block rounded-md px-3 py-1.5 data-[active]:bg-slate-100 text-slate-700">{cat}</button>
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>

                        <div className="w-px h-6 bg-slate-200" />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cerca prodotti..."
                            className="h-11 w-48 pl-4 pr-2 text-sm focus:outline-none rounded-r-lg"
                        />
                        <button type="submit" aria-label="Cerca" className="px-4 text-slate-500 hover:text-blue-600 cursor-pointer">
                            <IoIosSearch size={22} />
                        </button>
                    </form>

                    {/* Icone Azioni */}
                    <div className="flex items-center gap-5 text-slate-700">
                        <Link to="/wishlist" className="relative hover:text-blue-600 transition-colors">
                            <HiOutlineHeart size={26} />
                            {wishlistItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative hover:text-blue-600 transition-colors">
                            <HiOutlineShoppingBag size={26} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* --- Pulsante Menu per Mobile --- */}
                <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(true)} className="text-slate-700">
                        <FiMenu size={28} />
                    </button>
                </div>
            </div>

            {/* --- Menu Mobile gestito da Dialog di Headless UI --- */}
            <Dialog open={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="relative z-50 lg:hidden">
                {/* Overlay di sfondo */}
                <div className="fixed inset-0 bg-black/30 transition-opacity data-[closed]:opacity-0" aria-hidden="true" />

                {/* Pannello del menu */}
                <div className="fixed inset-0 flex justify-end">
                    <DialogPanel className="w-full max-w-xs bg-white p-6 transition-transform data-[closed]:translate-x-full">
                        <div className="flex justify-between items-center mb-10">
                            <DialogTitle className="text-2xl font-bold text-slate-800">Menu</DialogTitle>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <FiX size={28} />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)} // Chiude il menu al click
                                    className="text-xl text-slate-600 font-medium"
                                    style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>
                        <div className="mt-auto pt-10 border-t border-slate-200 flex justify-center gap-8">
                            {/* Qui si possono aggiungere le icone utente anche per mobile */}
                            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-slate-600"><HiOutlineHeart size={28} /></Link>
                            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-slate-600"><HiOutlineShoppingBag size={28} /></Link>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </header>
    );
};

export default HeaderBottom;
