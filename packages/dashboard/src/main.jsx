import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// -> Importa i componenti dalla libreria UI
import { LoadingPage, ErrorBoundary } from '@adesso/ui-components';
// -> Importa l'utility API dalla libreria di logica
import { setupAuthInterceptor } from '@adesso/core-logic';
// -> Importa lo store LOCALE del dashboard
import store from './store/store.js';

const App = lazy(() => import("./App"));

// Esegui il setup con lo store locale
setupAuthInterceptor(store);

const container = document.getElementById('root');
if (container && !container._reactRootContainer) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        {/* Passa lo store locale al Provider */}
        <Provider store={store}>
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
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
              success: {
                style: {
                  background: '#059669',
                },
                iconTheme: {
                  primary: '#F9FAFB',
                  secondary: '#059669',
                },
              },
              error: {
                style: {
                  background: '#DC2626',
                },
                iconTheme: {
                  primary: '#F9FAFB',
                  secondary: '#DC2626',
                },
              },
            }}
          />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}