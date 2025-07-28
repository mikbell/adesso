import React, { useEffect, useCallback } from 'react';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Importa le azioni aggiornate dal tuo cartSlice
import {
    fetchCart,
    removeFromCart,
    updateQuantity,
    clearCartAsync, // IMPORTA L'AZIONE ASINCRONA CORRETTA
} from '@adesso/core-logic';

// --- Dati di Configurazione ---
const SHIPPING_COST = 2.99;

// --- COMPONENTE PRINCIPALE: PAGINA CARRELLO ---
const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Ottieni lo stato del carrello da Redux, inclusi loader ed errorMessage
    const { items, total, loader, errorMessage } = useSelector((state) => state.cart);

    // Effettua il fetch del carrello all'avvio del componente
    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // Calcola il subtotale. Questo ora è il `total` direttamente dallo slice.
    const subtotal = total;

    // Funzione per aggiornare la quantità di un articolo
    const handleQuantityChange = useCallback((productId, newQuantity) => {
        const quantityToUpdate = Math.max(0, newQuantity); // Permetti 0 per la rimozione

        if (quantityToUpdate === 0) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateQuantity({ productId, quantity: quantityToUpdate }));
        }
    }, [dispatch]);

    // Funzione per rimuovere un articolo dal carrello
    const handleRemoveItem = useCallback((productId) => {
        dispatch(removeFromCart(productId));
    }, [dispatch]);

    // Funzione per svuotare l'intero carrello
    const handleClearCart = useCallback(() => {
        dispatch(clearCartAsync()); // USA L'AZIONE ASINCRONA QUI
    }, [dispatch]);

    const handleCheckout = (e) => {
        e.preventDefault();
        navigate('/checkout', {
            state: {
                cartItems: items,
                cartItemsCount: items ? items.length : 0,
                shippingCost: SHIPPING_COST,
                subtotal: subtotal,
                total: subtotal + SHIPPING_COST
            }
        });
    };

    // --- Gestione dello stato di caricamento e errore ---
    if (loader) {
        return (
            <div className="min-h-screen font-sans flex items-center justify-center">
                <p className="text-lg text-gray-600">Caricamento del carrello...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="min-h-screen font-sans flex items-center justify-center">
                <p className="text-lg text-red-500">Errore nel caricamento del carrello: {errorMessage}</p>
            </div>
        );
    }

    // Se il carrello è ancora undefined o null dopo il caricamento, o non è un array
    if (!items || !Array.isArray(items)) {
        return (
            <div className="min-h-screen font-sans flex items-center justify-center">
                <p className="text-lg text-gray-500">Nessun dato del carrello disponibile.</p>
            </div>
        );
    }

    // --- Render del componente ---
    return (
        <div className="min-h-screen font-sans">
            <main className="mx-auto w-[90%] max-w-6xl py-16">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Il tuo Carrello</h1>
                <p className="text-slate-500 mb-8">Controlla e completa il tuo ordine.</p>

                {items.length > 0 ? (
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
                        {/* Colonna sinistra: Articoli del carrello */}
                        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <ul role="list" className="divide-y divide-slate-200">
                                {items.map(item => (
                                    <li key={item._id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                                            <img src={item.image || `https://placehold.co/600x600/CCCCCC/000000?text=No+Image`} alt={item.name} className="h-full w-full object-cover object-center" />
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
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-l-md cursor-pointer"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 py-1 text-slate-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-r-md cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item._id)}
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
                            {items.length > 0 && (
                                <div className="mt-6 text-right">
                                    <button
                                        onClick={handleClearCart} // Ora chiama la funzione che dispatcha clearCartAsync
                                        className="text-sm font-medium text-red-600 hover:text-red-800"
                                    >
                                        Svuota Carrello
                                    </button>
                                </div>
                            )}
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