import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuthContext } from '../contexts/AuthContext/AuthContext';

export function ProtectedRoute() {
    const { userJwt, currentUser } = useUserAuthContext();
    return (userJwt && currentUser) ? <Outlet /> : <Navigate to="/signin" replace />;
}

export function AdminRoute() {
    const { userJwt, currentUser } = useUserAuthContext();
    if (!userJwt) return <Navigate to="/signin" replace />;
    if (currentUser?.role !== 'Admin') return <Navigate to="/dashboard" replace />;
    return <Outlet />;
}
