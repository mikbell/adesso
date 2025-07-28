import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roles, route, children }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    const allowedRoles = roles || (route?.role ? [route.role] : []);

    if (allowedRoles.length > 0 && !allowedRoles.includes(userInfo.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (route?.statuses && !route.statuses.includes(userInfo.status)) {
        if (userInfo.status === 'pending') return <Navigate to="/seller/account-pending" replace />;
        if (userInfo.status === 'deactive') return <Navigate to="/seller/account-deactive" replace />;
        return <Navigate to={`/${userInfo.role}/dashboard`} replace />;
    }
    return children;
};

export default ProtectedRoute;