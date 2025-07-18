// src/components/shared/ErrorBoundary.jsx
import React from 'react';
import CustomButton from './CustomButton'; // Riutilizziamo il nostro bottone
import { FiAlertTriangle } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // Questo metodo aggiorna lo stato per mostrare l'UI di fallback.
    static getDerivedStateFromError(error) {
        console.error("Errore nell'Error Boundary:", error);
        return { hasError: true };
    }

    // Questo metodo viene usato per loggare l'errore (es. su un servizio esterno).
    componentDidCatch(error, errorInfo) {
        console.error("Errore catturato dall'Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // UI di fallback da mostrare in caso di errore
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
                    <FiAlertTriangle className="text-red-500 h-16 w-16 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Oops! Qualcosa è andato storto.</h1>
                    <p className="text-gray-600 mt-2">
                        Si è verificato un errore inaspettato. Il nostro team è stato notificato.
                    </p>
                    <CustomButton
                        onClick={() => window.location.reload()}
                        className="mt-6"
                        variant="primary"
                    >
                        Ricarica la Pagina
                    </CustomButton>
                </div>
            );
        }

        // Se non ci sono errori, renderizza i componenti figli normalmente.
        return this.props.children;
    }
}

export default ErrorBoundary;