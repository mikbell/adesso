import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { StandardTable, CustomButton, LoadingPage, StatusBadge, TableHeader, TablePagination } from '@adesso/ui-components';
import { getPaymentRequests, confirmPaymentRequest, clearPaymentMessages } from '@adesso/core-logic';

const PaymentRequests = () => {
    const dispatch = useDispatch();
    const { paymentRequests, loader, successMessage, errorMessage } = useSelector(state => state.payment);

    useEffect(() => {
        dispatch(getPaymentRequests());
    }, [dispatch, successMessage]); // Ricarica dopo un'azione di successo

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearPaymentMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearPaymentMessages());
        }
    }, [successMessage, errorMessage, dispatch]);

    const handleConfirmRequest = useCallback((paymentId) => {
        if (window.confirm('Sei sicuro di voler confermare questa richiesta di pagamento?')) {
            dispatch(confirmPaymentRequest(paymentId));
        }
    }, [dispatch]);

    const columns = useMemo(() => [
        {
            header: 'Venditore',
            render: (req) => (
                <div className="flex items-center gap-3">
                    <img src={req.sellerId?.avatarUrl} alt={req.sellerId?.name} className='w-10 h-10 object-cover rounded-full' />
                    <span className="font-medium">{req.sellerId?.name || 'N/D'}</span>
                </div>
            )
        },
        { header: 'Importo', render: (req) => `€${req.amount.toFixed(2)}` },
        { header: 'Data Richiesta', render: (req) => new Date(req.createdAt).toLocaleDateString('it-IT') },
        { header: 'Stato', render: (req) => <StatusBadge status={req.status} /> },
        {
            header: 'Azioni',
            render: (req) => (
                <div className="flex justify-end">
                    {req.status === 'pending' && (
                        <CustomButton onClick={() => handleConfirmRequest(req._id)} variant="success" size="sm">
                            Conferma Pagamento
                        </CustomButton>
                    )}
                </div>
            )
        },
    ], [handleConfirmRequest]);

    if (loader && paymentRequests.length === 0) {
        return <LoadingPage />;
    }

    return (
        <div className='p-4 md:p-6'>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <TableHeader title="Richieste di Pagamento" />
                <StandardTable
                    data={paymentRequests}
                    columns={columns}
                    loader={loader}
                />
            </div>
        </div>
    );
};

export default PaymentRequests;