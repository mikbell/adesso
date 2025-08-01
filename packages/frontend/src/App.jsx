import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Shop from './pages/Shop'
import MainLayout from './layouts/MainLayout'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Details from './pages/Details'
import { LoadingPage, ScrollToTop } from '@adesso/ui-components'
import CategoryShop from './pages/CategoryShop'
import SearchResultsShop from './pages/SearchResultsShop'

function App() {

  return (
    <Suspense fallback={<LoadingPage />}>
      <MainLayout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products?" element={<CategoryShop />} />
          <Route path="/products/search?" element={<SearchResultsShop />} />
          <Route path="/products/:slug" element={<Details />} />
        </Routes>
      </MainLayout>
    </Suspense>
  )
}

export default App
