// src/pages/admin/OrderDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiTruck, FiCreditCard, FiPrinter, FiAlertCircle } from 'react-icons/fi';

// ▼▼▼ AGGIORNATO L'IMPORT DEI DATI E DEI COMPONENTI ▼▼▼
import { fetchDetailedOrderById } from '../../data/ordersData';
import Button from "../../components/shared/Button";
import ActionsMenu from '../../components/shared/ActionsMenu';
import StatusBadge from '../../components/shared/StatusBadge';
import OrderTimeline from '../../components/orders/OrderTimeline';
import InfoCard from '../../components/orders/InfoCard';
import ProductsTable from '../../components/orders/ProductsTable';

const OrderDetails = () => {
    const { id } = useParams(); // cambiato da 'id' a 'id' per coerenza
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            setLoading(true);
            try {
                // ▼▼▼ USA LA NUOVA FUNZIONE PER I DETTAGLI ▼▼▼
                const data = await fetchDetailedOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error("Ordine non trovato:", error);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [id]);

    // Definiamo le azioni per il menu nell'intestazione
    const headerActions = [
        {
            key: 'support',
            items: [
                { label: 'Segnala un problema', icon: FiAlertCircle, onClick: (item) => alert(`Segnalazione per l'ordine ${item.id}`) }
            ]
        }
    ];

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Caricamento dettagli ordine...</div>;
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-500">Ordine Non Trovato</h2>
                <p className="text-gray-600 mt-2">L'ID dell'ordine ({id}) potrebbe non essere corretto.</p>
                <Button variant="primary" onClick={() => navigate('/admin/dashboard/orders')} className='mt-4'>
                    Torna a Tutti gli Ordini
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <Link to="/admin/dashboard/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-2">
                        <FiArrowLeft /><span>Torna agli ordini</span>
                    </Link>
                    <div className='flex items-center gap-4'>
                        <h1 className="text-3xl font-bold text-gray-800">Ordine {order.id}</h1>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Data: {new Date(order.date).toLocaleDateString('it-IT')}</p>
                </div>
                {/* ▼▼▼ AGGIUNTI I PULSANTI DI AZIONE ▼▼▼ */}
                <div className="flex items-center gap-2">
                    <Button variant="secondary" icon={FiPrinter}>Stampa Fattura</Button>
                    <ActionsMenu item={order} actionGroups={headerActions} />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProductsTable products={order.products} total={order.total} />
                    <OrderTimeline history={order.history} />
                </div>
                <div className="space-y-6">
                    <InfoCard title="Cliente" icon={<FiUser />}>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    </InfoCard>
                    <InfoCard title="Indirizzo di Spedizione" icon={<FiTruck />}>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                    </InfoCard>
                    <InfoCard title="Pagamento" icon={<FiCreditCard />}>
                        <p className="text-sm text-gray-600 capitalize">Metodo: {order.payment.method}</p>
                        <p className="text-sm text-gray-500 truncate">Transazione: {order.payment.transactionId}</p>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;