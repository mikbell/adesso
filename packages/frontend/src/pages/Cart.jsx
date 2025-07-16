import React, { useState, useEffect } from 'react';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// --- DATI DI ESEMPIO (In un'app reale, questi dati proverrebbero dallo stato globale o dalle props) ---
const initialCartItems = [
    { id: 1, name: 'Cuffie Wireless Pro', category: 'Elettronica', price: 199.99, quantity: 1, image: 'https://placehold.co/600x600/3B82F6/FFFFFF?text=Cuffie' },
    { id: 4, name: 'Sneakers da Corsa', category: 'Sport', price: 120.00, quantity: 1, image: 'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Scarpe' },
    { id: 2, name: 'T-Shirt in Cotone', category: 'Abbigliamento', price: 29.99, quantity: 2, image: 'https://placehold.co/600x600/10B981/FFFFFF?text=T-Shirt' },
];

const SHIPPING_COST = 9.99;

// --- COMPONENTE PRINCIPALE: PAGINA CARRELLO ---
const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [subtotal, setSubtotal] = useState(0);

    // Calcola il subtotale ogni volta che il carrello cambia
    useEffect(() => {
        const newSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setSubtotal(newSubtotal);
    }, [cartItems]);

    const handleCheckout = (e) => {
        e.preventDefault();
        navigate('/checkout', { state: { cartItems, cartItemsCount: cartItems.length, shippingCost: SHIPPING_COST, subtotal, total: subtotal + SHIPPING_COST } });
    }

    // Funzione per aggiornare la quantità di un articolo
    const handleQuantityChange = (id, newQuantity) => {
        // La quantità non può essere inferiore a 1
        const quantity = Math.max(1, newQuantity);
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    // Funzione per rimuovere un articolo dal carrello
    const handleRemoveItem = (id) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    // --- Render del componente ---
    return (
        <div className="min-h-screen font-sans">
            <main className="mx-auto w-[90%] max-w-6xl py-16">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Il tuo Carrello</h1>
                <p className="text-slate-500 mb-8">Controlla e completa il tuo ordine.</p>

                {cartItems.length > 0 ? (
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
                        {/* Colonna sinistra: Articoli del carrello */}
                        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <ul role="list" className="divide-y divide-slate-200">
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-slate-900">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                {/* Selettore Quantità */}
                                                <div className="flex items-center border border-slate-300 rounded-md">
                                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-l-md">-</button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                                        className="w-12 text-center border-l border-r border-slate-300 focus:ring-0 focus:border-slate-300"
                                                        min="1"
                                                    />
                                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-r-md">+</button>
                                                </div>

                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="font-medium text-red-600 hover:text-red-800 flex items-center gap-1"
                                                    >
                                                        <FiTrash2 />
                                                        <span>Rimuovi</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Colonna destra: Riepilogo ordine */}
                        <section className="lg:col-span-1 mt-8 lg:mt-0 bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-4">Riepilogo Ordine</h2>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">Subtotale</p>
                                    <p className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">Spedizione</p>
                                    <p className="text-sm font-medium text-slate-900">${SHIPPING_COST.toFixed(2)}</p>
                                </div>
                                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                                    <p className="text-base font-semibold text-slate-900">Totale Ordine</p>
                                    <p className="text-base font-semibold text-slate-900">${(subtotal + SHIPPING_COST).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button onClick={handleCheckout} className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    Procedi al Checkout
                                </button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                                <p>
                                    o{' '}
                                    <Link to="/shop" className="font-medium text-blue-600 hover:text-blue-500">
                                        Continua lo Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </Link>
                                </p>
                            </div>
                        </section>
                    </div>
                ) : (
                    // Vista per il carrello vuoto
                    <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-800">Il tuo carrello è vuoto</h2>
                        <p className="mt-2 text-slate-500">Sembra che tu non abbia ancora aggiunto nulla. Inizia ad esplorare!</p>
                        <div className="mt-6">
                            <Link to="/shop" className="inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700">
                                <FiArrowLeft />
                                Torna al Negozio
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );

};

export default Cart;