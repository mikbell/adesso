import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/index'
import { Toaster } from 'react-hot-toast'
import Loading from './components/shared/Loading'
const App = lazy(() => import("./App"))

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <App />
        <Toaster
          toastOptions={{
            position: 'top-right',
            style: {
              background: '#333',
              color: '#fff',
            }
          }} />
      </Suspense>
    </Provider>
  </BrowserRouter>,
)
