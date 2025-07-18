import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Importa i componenti e la logica necessari
import { store, setupAuthInterceptor } from '@adesso/core-logic';
import { ErrorBoundary, LoadingPage } from '@adesso/ui-components';

// Carica il componente App in modo "lazy" per ottimizzare le performance
const App = lazy(() => import("./App.jsx"));

// Esegui il setup dell'interceptor API prima di renderizzare l'app
setupAuthInterceptor(store);

const container = document.getElementById('root');

// Questo controllo previene errori con l'Hot Module Replacement in sviluppo
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<LoadingPage />}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </Suspense>

          {/* Il Toaster per le notifiche vive qui */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#374151',
                color: '#F9FAFB',
              },
            }}
          />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}