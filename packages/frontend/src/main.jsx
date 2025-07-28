import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react'; // Importa PersistGate
import './index.css';

// Importa i componenti e la logica necessari
// Ora assumiamo che '@adesso/core-logic' esporterà anche il 'persistor'
import { store, persistor, setupAuthInterceptor } from '@adesso/core-logic';
import { ErrorBoundary, LoadingPage } from '@adesso/ui-components';

// Carica il componente App in modo "lazy" per ottimizzare le performance
const App = lazy(() => import("./App.jsx"));

// Esegui il setup dell'interceptor API prima di renderizzare l'app
setupAuthInterceptor(store);

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        {/* Avvolgi il resto dell'applicazione con PersistGate */}
        <PersistGate loading={<LoadingPage />} persistor={persistor}>
          <BrowserRouter>
            <Suspense fallback={<LoadingPage />}>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </Suspense>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#374151',
                  color: '#F9FAFB',
                },
              }}
            />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}