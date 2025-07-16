import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store';
import { Toaster } from 'react-hot-toast';

// Importa i nuovi componenti
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingPage from './components/shared/LoadingPage';
import { setupAuthInterceptor } from './api/api.js';

const App = lazy(() => import("./App"));


setupAuthInterceptor(store);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
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