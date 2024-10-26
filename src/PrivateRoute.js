import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('userID'); // Verifica si el usuario está autenticado

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
