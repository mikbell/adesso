import React, { useState, useEffect } from 'react';
import { FiLock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import CustomInput from '../components/shared/CustomInput';
import CustomButton from '../components/shared/CustomButton';

// --- DATI DI ESEMPIO (In un'app reale, proverrebbero dal carrello) ---
const cartItems = [
    { id: 1, name: 'Cuffie Wireless Pro', price: 199.99, quantity: 1, image: 'https://placehold.co/200x200/3B82F6/FFFFFF?text=Cuffie' },
    { id: 4, name: 'Sneakers da Corsa', price: 120.00, quantity: 1, image: 'https://placehold.co/200x200/8B5CF6/FFFFFF?text=Scarpe' },
    { id: 2, name: 'T-Shirt in Cotone', price: 29.99, quantity: 2, image: 'https://placehold.co/200x200/10B981/FFFFFF?text=T-Shirt' },
];

const SHIPPING_COST = 9.99;

// --- COMPONENTE PRINCIPALE: PAGINA CHECKOUT ---
const Checkout = () => {

    const [state, setState] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const [subtotal, setSubtotal] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Calcola il subtotale all'avvio
    useEffect(() => {
        const newSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setSubtotal(newSubtotal);
    }, []);

    const total = subtotal + SHIPPING_COST;

    // Gestisce l'invio del form
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setShowSuccessModal(true);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main className="mx-auto w-[90%] max-w-7xl py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                    {/* Colonna Sinistra: Modulo Informazioni */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-800">Informazioni di Spedizione</h2>
                        {/* Aggiunto id e onSubmit al form */}
                        <form id="checkout-form" onSubmit={handleFormSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            {/* Informazioni di Contatto */}
                            <CustomInput label="Email" name="email" type="email" required={true} onChange={handleChange} />

                            {/* Indirizzo di Spedizione */}
                            <div className="sm:col-span-2">
                                <h3 className="text-lg font-medium text-slate-900 mt-4">Indirizzo di Spedizione</h3>
                            </div>

                            <CustomInput label="Nome" name="name" type="text" required={true} onChange={handleChange} />
                            <CustomInput label="Cognome" name="lastName" type="text" required={true} onChange={handleChange} />
                            <CustomInput label="Indirizzo" name="address" type="text" required={true} onChange={handleChange} />
                            <CustomInput label="Città" name="city" type="text" required={true} onChange={handleChange} />
                            <CustomInput label="CAP" name="postalCode" type="text" required={true} onChange={handleChange} />

                            {/* Dettagli di Pagamento */}
                            <div className="sm:col-span-2 pt-6 border-t border-slate-200">
                                <h3 className="text-lg font-medium text-slate-900">Dettagli di Pagamento</h3>
                            </div>
                            <CustomInput label="Nome sulla Carta" name="card-name" type="text" autoComplete="cc-name" onChange={handleChange} required={true} />
                            <CustomInput label="Numero Carta" name="card-number" type="text" autoComplete="cc-number" onChange={handleChange} placeholder="•••• •••• •••• ••••" required={true} />
                            <CustomInput label="Data di Scadenza" name="expiration-date" type="text" autoComplete="cc-exp" onChange={handleChange} placeholder="MM/AA" required={true} />
                            <CustomInput label="CVV" name="cvv" type="text" autoComplete="cc-csc" onChange={handleChange} placeholder="•••" required={true} />
                        </form>
                    </div>

                    {/* Colonna Destra: Riepilogo Ordine */}
                    <div className="mt-10 lg:mt-0">
                        <h2 className="text-2xl font-semibold text-slate-800">Riepilogo Ordine</h2>
                        <div className="mt-4 bg-white rounded-lg shadow-sm">
                            <ul role="list" className="divide-y divide-slate-200 p-6">
                                {cartItems.map((product) => (
                                    <li key={product.id} className="flex items-center py-4">
                                        <img src={product.image} alt={product.name} className="h-16 w-16 flex-shrink-0 rounded-md border border-slate-200" />
                                        <div className="ml-4 flex-1">
                                            <p className="font-medium text-slate-900">{product.name}</p>
                                            <p className="text-sm text-slate-500">Quantità: {product.quantity}</p>
                                        </div>
                                        <p className="font-medium text-slate-900">${(product.price * product.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-slate-200 p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">Subtotale</p>
                                    <p className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">Spedizione</p>
                                    <p className="text-sm font-medium text-slate-900">${SHIPPING_COST.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                    <p className="text-base font-semibold text-slate-900">Totale</p>
                                    <p className="text-base font-semibold text-slate-900">${total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            {/* Aggiunto attributo form per collegare il bottone al form */}
                            <CustomButton
                                type="submit"
                                form="checkout-form"
                                className="w-full">
                                <FiLock className="mr-2 h-5 w-5" />
                                Paga ${total.toFixed(2)}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modale di Successo */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center transform transition-all scale-95 opacity-0 animate-fade-in-scale">
                        <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Grazie!</h3>
                        <p className="text-slate-600 mb-6">Il tuo ordine è stato inviato con successo.</p>
                        <CustomButton
                            onClick={() => setShowSuccessModal(false)}>
                            Chiudi
                        </CustomButton>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes fade-in-scale {
                    0% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Checkout;
