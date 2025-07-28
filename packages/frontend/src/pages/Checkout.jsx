import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiLock, FiCreditCard } from 'react-icons/fi';
import { CustomInput, CustomButton } from '@adesso/ui-components';
import { createOrder, clearCartAsync } from '@adesso/core-logic';
import { PulseLoader } from 'react-spinners';

// COSTO DI SPEDIZIONE FISSO
const SHIPPING_COST = 2.99;

// COMPONENTE PRINCIPALE: PAGINA CHECKOUT
const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Ottieni gli elementi del carrello e lo stato dell'ordine dallo stato Redux
    const { items, total: subtotal } = useSelector(state => state.cart);
    const { loader: orderLoader, successMessage, errorMessage } = useSelector(state => state.order);

    const [formState, setFormState] = useState({
        name: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        cardName: '',
        cardNumber: '',
        expirationDate: '',
        cvv: ''
    });

    const [formErrors, setFormErrors] = useState({});

    // Calcola il totale complessivo dell'ordine
    const total = subtotal + SHIPPING_COST;

    // Reindirizza l'utente se il carrello è vuoto
    useEffect(() => {
        if (items.length === 0 && !orderLoader) {
            navigate('/cart');
        }
    }, [items, orderLoader, navigate]);

    // Gestione dei messaggi di successo o errore dopo l'ordine
    useEffect(() => {
        if (successMessage) {
            // Svuota il carrello dopo un ordine andato a buon fine
            dispatch(clearCartAsync());
            navigate('/order-success'); // Reindirizza a una pagina di successo
        }
        if (errorMessage) {
            // Mostra un feedback all'utente in caso di errore
            alert(`Errore nell'ordine: ${errorMessage}`);
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    // Gestore per l'aggiornamento dei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
        // Rimuove l'errore del campo non appena l'utente inizia a digitare
        setFormErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    // Funzione di validazione del form
    const validateForm = () => {
        const errors = {};
        if (!formState.email) errors.email = "L'email è richiesta.";
        if (!formState.name) errors.name = "Il nome è richiesto.";
        if (!formState.lastName) errors.lastName = "Il cognome è richiesto.";
        if (!formState.address) errors.address = "L'indirizzo è richiesto.";
        if (!formState.city) errors.city = "La città è richiesta.";
        if (!formState.postalCode) errors.postalCode = "Il CAP è richiesto.";
        if (!formState.cardNumber) errors.cardNumber = "Il numero della carta è richiesto.";
        if (!formState.expirationDate) errors.expirationDate = "La data di scadenza è richiesta.";
        if (!formState.cvv) errors.cvv = "Il CVV è richiesto.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Gestore per l'invio del form
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (validateForm()) {
            // Prepara i dati per l'invio al backend
            const orderData = {
                shippingInfo: formState,
                cartItems: items.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name, // Invia anche il nome del prodotto
                })),
                total,
            };

            // Dispatch dell'azione di creazione dell'ordine
            dispatch(createOrder(orderData));
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main className="mx-auto w-[90%] max-w-7xl py-12 lg:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                    {/* Colonna Sinistra: Modulo Informazioni */}
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-800">Informazioni di Spedizione</h2>
                        <form id="checkout-form" onSubmit={handleFormSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <CustomInput
                                label="Email" name="email" type="email"
                                onChange={handleChange} value={formState.email}
                                error={formErrors.email} required={true}
                            />
                            <div className="sm:col-span-2">
                                <h3 className="text-lg font-medium text-slate-900 mt-4">Indirizzo di Spedizione</h3>
                            </div>
                            <CustomInput
                                label="Nome" name="name" type="text"
                                onChange={handleChange} value={formState.name}
                                error={formErrors.name} required={true}
                            />
                            <CustomInput
                                label="Cognome" name="lastName" type="text"
                                onChange={handleChange} value={formState.lastName}
                                error={formErrors.lastName} required={true}
                            />
                            <CustomInput
                                label="Indirizzo" name="address" type="text"
                                onChange={handleChange} value={formState.address}
                                error={formErrors.address} required={true}
                            />
                            <CustomInput
                                label="Città" name="city" type="text"
                                onChange={handleChange} value={formState.city}
                                error={formErrors.city} required={true}
                            />
                            <CustomInput
                                label="CAP" name="postalCode" type="text"
                                onChange={handleChange} value={formState.postalCode}
                                error={formErrors.postalCode} required={true}
                            />
                            <div className="sm:col-span-2 pt-6 border-t border-slate-200">
                                <h3 className="text-lg font-medium text-slate-900">Dettagli di Pagamento</h3>
                            </div>
                            <CustomInput
                                label="Nome sulla Carta" name="cardName" type="text"
                                autoComplete="cc-name" onChange={handleChange}
                                value={formState.cardName} required={true} error={formErrors.cardName}
                            />
                            <CustomInput
                                label="Numero Carta" name="cardNumber" type="text"
                                autoComplete="cc-number" onChange={handleChange}
                                placeholder="•••• •••• •••• ••••" required={true}
                                value={formState.cardNumber} error={formErrors.cardNumber}
                            />
                            <CustomInput
                                label="Data di Scadenza" name="expirationDate" type="text"
                                autoComplete="cc-exp" onChange={handleChange}
                                placeholder="MM/AA" required={true}
                                value={formState.expirationDate} error={formErrors.expirationDate}
                            />
                            <CustomInput
                                label="CVV" name="cvv" type="text"
                                autoComplete="cc-csc" onChange={handleChange}
                                placeholder="•••" required={true}
                                value={formState.cvv} error={formErrors.cvv}
                            />
                        </form>
                    </div>

                    {/* Colonna Destra: Riepilogo Ordine */}
                    <div className="mt-10 lg:mt-0">
                        <h2 className="text-2xl font-semibold text-slate-800">Riepilogo Ordine</h2>
                        <div className="mt-4 bg-white rounded-lg shadow-sm">
                            <ul role="list" className="divide-y divide-slate-200 p-6">
                                {items.map((product) => (
                                    <li key={product._id} className="flex items-center py-4">
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
                            <CustomButton
                                type="submit"
                                form="checkout-form"
                                className="w-full"
                                disabled={orderLoader || items.length === 0}
                            >
                                {orderLoader ? (
                                    <div className="flex items-center justify-center">
                                        <PulseLoader color="#fff" size={8} className="mr-2" />
                                        <span>Elaborazione...</span>
                                    </div>
                                ) : (
                                    <>
                                        <FiLock className="mr-2 h-5 w-5" />
                                        Paga ${total.toFixed(2)}
                                    </>
                                )}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;