import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Componenti, Utilità e Icone
import { FiArrowLeft, FiUser, FiTruck, FiCreditCard, FiPrinter } from 'react-icons/fi';
import { CustomButton, StatusBadge, InfoCard, ProductsTable, OrderTimeline, LoadingPage } from '@adesso/ui-components';

// Azioni Redux
import { getOrderDetails, clearOrderDetails, clearOrderMessages } from '@adesso/core-logic';


const OrderDetails = () => {
    const { orderId } = useParams(); // Usiamo un nome più descrittivo
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Legge i dati e lo stato dallo store Redux
    const { orderDetails: order, loader, errorMessage, successMessage } = useSelector(state => state.order);

    // Carica i dati dell'ordine e li pulisce all'uscita
    useEffect(() => {
        dispatch(getOrderDetails(orderId));
        return () => {
            dispatch(clearOrderDetails());
        };
    }, [orderId, dispatch]);

    // Gestisce le notifiche (toast)
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearOrderMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearOrderMessages());
        }
    }, [successMessage, errorMessage, dispatch]);


    if (loader || !order) {
        return <LoadingPage />;
    }

    if (errorMessage && !order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-500">{errorMessage}</h2>
                <CustomButton onClick={() => navigate('/admin/dashboard/orders')} className='mt-4'>
                    Torna agli Ordini
                </CustomButton>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <CustomButton to="/admin/dashboard/orders" variant="link" className="text-sm flex items-center gap-2">
                        <FiArrowLeft /><span>Torna agli ordini</span>
                    </CustomButton>
                    <div className='flex items-center gap-4 mt-2'>
                        <h1 className="text-3xl font-bold text-gray-800">Ordine #{order.orderId}</h1>
                        <StatusBadge status={order.status} />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Data: {new Date(order.createdAt).toLocaleDateString('it-IT')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <CustomButton variant="secondary" icon={<FiPrinter />}>Stampa</CustomButton>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProductsTable products={order.products} total={order.totalAmount} />
                    {order.history && <OrderTimeline history={order.history} />}
                </div>
                <div className="space-y-6">
                    <InfoCard title="Cliente" icon={<FiUser />}>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                        {order.customerId?.email && <p className="text-sm text-gray-500">{order.customerId.email}</p>}
                    </InfoCard>
                    <InfoCard title="Indirizzo di Spedizione" icon={<FiTruck />}>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                    </InfoCard>
                    {/* Aggiungi qui altre InfoCard se necessario, es. per il pagamento */}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;