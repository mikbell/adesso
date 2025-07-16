import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Shop from './pages/Shop'
import MainLayout from './layouts/MainLayout'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Details from './pages/Details'

function App() {

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/details/:slug" element={<Details />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
