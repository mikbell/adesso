// src/views/Home.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
    const { userInfo } = useSelector((state) => state.auth);

    if (userInfo) {
        return (
            <div>
                <h1>Benvenuto nella tua dashboard, {userInfo.name}!</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Benvenuto nel nostro e-commerce!</h1>
            <p>Accedi o registrati per iniziare.</p>
        </div>
    );
};

export default Home;