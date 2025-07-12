import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roles, route, children }) => {
    const { userInfo } = useSelector((state) => state.auth);

    // 1. L'utente è loggato? (Nessuna modifica qui)
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    // --- LOGICA MIGLIORATA ---

    // 2. Determina quali ruoli sono permessi
    //    Usa la prop 'roles' se esiste, altrimenti prendi il ruolo dalla prop 'route'.
    const allowedRoles = roles || (route?.role ? [route.role] : []);

    // 3. L'utente ha il ruolo corretto?
    if (allowedRoles.length > 0 && !allowedRoles.includes(userInfo.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 4. L'utente ha lo stato corretto?
    //    Usiamo l'optional chaining (route?.statuses) per evitare errori se 'route' è undefined.
    if (route?.statuses && !route.statuses.includes(userInfo.status)) {
        if (userInfo.status === 'pending') return <Navigate to="/seller/account-pending" replace />;
        if (userInfo.status === 'deactive') return <Navigate to="/seller/account-deactive" replace />;
        return <Navigate to={`/${userInfo.role}/dashboard`} replace />;
    }

    // 5. Se tutti i controlli passano, mostra la pagina
    return children;
};

export default ProtectedRoute;