// src/pages/PaymentRequests.jsx
import React, { useState, useEffect, useMemo } from 'react';
import StandardTable from '../../components/tables/StandardTable'; // Importa il componente Table generico
import PaymentRequestsTableRow from '../../components/tables/PaymentRequestsTableRow';

const PaymentRequests = () => {
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulazione del fetching di dati di richieste di pagamento
        const fetchPaymentRequests = async () => {
            setLoading(true);
            const dummyData = [
                { id: 'PAY001', number: '#PAY001', amount: '€150.00', status: 'In attesa', date: '2024-06-25' },
                { id: 'PAY002', number: '#PAY002', amount: '€230.50', status: 'Confermato', date: '2024-06-24' },
                { id: 'PAY003', number: '#PAY003', amount: '€90.00', status: 'In attesa', date: '2024-06-23' },
                { id: 'PAY004', number: '#PAY004', amount: '€500.00', status: 'Rifiutato', date: '2024-06-22' },
                { id: 'PAY005', number: '#PAY005', amount: '€75.00', status: 'In attesa', date: '2024-06-21' },
                { id: 'PAY006', number: '#PAY006', amount: '€120.00', status: 'Confermato', date: '2024-06-20' },
                { id: 'PAY007', number: '#PAY007', amount: '€300.00', status: 'In attesa', date: '2024-06-19' },
                { id: 'PAY008', number: '#PAY008', amount: '€45.00', status: 'In attesa', date: '2024-06-18' },
                { id: 'PAY009', number: '#PAY009', amount: '€700.00', status: 'Rifiutato', date: '2024-06-17' },
                { id: 'PAY010', number: '#PAY010', amount: '€88.00', status: 'Confermato', date: '2024-06-16' },
                { id: 'PAY011', number: '#PAY011', amount: '€110.00', status: 'In attesa', date: '2024-06-15' },
                { id: 'PAY012', number: '#PAY012', amount: '€25.00', status: 'In attesa', date: '2024-06-14' },
            ];
            setPaymentRequests(dummyData);
            setLoading(false);
        };

        fetchPaymentRequests();
    }, []);

    // Definisci le colonne per la tabella delle richieste di pagamento
    const paymentTableColumns = useMemo(() => [
        { header: 'Numero', accessor: 'number' },
        { header: 'Importo', accessor: 'amount' },
        { header: 'Stato', accessor: 'status' },
        { header: 'Data', accessor: 'date' },
        {
            header: 'Azioni', render: (request) => (
                <div className="flex justify-end items-center">
                    {request.status === 'In attesa' && (
                        <button
                            onClick={() => handleConfirmRequest(request.number)}
                            className="text-green-600 hover:text-green-800 mr-2"
                        >
                            Conferma
                        </button>
                    )}
                    <button className="text-red-600 hover:text-red-800">Rifiuta</button>
                </div>
            )
        },
    ], []); // Le dipendenze sono vuote perché la struttura delle colonne è fissa

    const handleConfirmRequest = (requestNumber) => {
        console.log('Conferma richiesta di pagamento:', requestNumber);
        // Aggiorna lo stato della richiesta a 'Confermato' nel frontend
        setPaymentRequests(prevRequests =>
            prevRequests.map(req =>
                req.number === requestNumber ? { ...req, status: 'Confermato' } : req
            )
        );
        // Qui dovresti fare una chiamata API al backend per aggiornare lo stato del pagamento
        // Esempio: api.confirmPayment(requestNumber);
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-700">Caricamento richieste di pagamento...</div>
        );
    }

    return (
        <div className='px-4 md:px-7 py-5'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    Richieste di Pagamento
                </h1>
                {/* Puoi aggiungere qui un pulsante per creare una nuova richiesta, se necessario */}
            </div>

            <StandardTable
                data={paymentRequests}
                columns={paymentTableColumns}
                renderRow={(request) => (
                    // La funzione renderRow passa ogni 'request' al componente PaymentRequestsTableRow
                    <PaymentRequestsTableRow
                        key={request.id} // Assicurati che ogni richiesta abbia un ID unico
                        request={request}
                        onConfirm={handleConfirmRequest} // Passa la funzione per la conferma
                    />
                )}
                title="" // Il titolo è gestito dall'h1 sopra
                showSearch={true}
                showItemsPerPage={true}
                showViewAllLink={false} // Non serve un link "Mostra Tutti" in una pagina già dedicata
            />
        </div>
    );
};

export default PaymentRequests;