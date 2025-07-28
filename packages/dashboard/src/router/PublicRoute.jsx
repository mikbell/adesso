import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const PublicRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (userInfo) {
        if (userInfo.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/seller/dashboard" replace />;
    }
    return children;
};

export default PublicRoute;