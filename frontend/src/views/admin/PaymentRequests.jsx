import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import StandardTable from '../../components/tables/StandardTable';
import CustomButton from '../../components/shared/CustomButton';
import LoadingPage from '../../components/shared/LoadingPage';
import { getStatusClasses } from '../../utils/status';
import { getPaymentRequests, confirmPaymentRequest, clearPaymentMessages } from '../../store/reducers/paymentSlice';

const PaymentRequests = () => {
    const dispatch = useDispatch();
    const { paymentRequests, loader, successMessage, errorMessage } = useSelector(state => state.payment);

    useEffect(() => {
        dispatch(getPaymentRequests());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearPaymentMessages());
            dispatch(getPaymentRequests());
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

    const paymentTableColumns = useMemo(() => [
        { header: 'ID Venditore', accessor: 'sellerId' }, // Mostra l'ID del venditore
        { header: 'Importo', render: (req) => `€${req.amount.toFixed(2)}` },
        { header: 'Data Richiesta', render: (req) => new Date(req.createdAt).toLocaleDateString('it-IT') },
        {
            header: 'Stato', render: (req) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(req.status)}`}>
                    {req.status}
                </span>
            )
        },
        {
            header: 'Azioni', render: (req) => (
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
        <div className='px-4 md:px-7 py-5'>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Richieste di Pagamento</h1>
            <StandardTable
                data={paymentRequests}
                columns={paymentTableColumns}
                loader={loader}
            />
        </div>
    );
};

export default PaymentRequests;