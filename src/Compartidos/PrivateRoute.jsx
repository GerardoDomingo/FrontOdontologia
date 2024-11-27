import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Valida el estado de inicio de sesión
      setIsAuthenticated(isLoggedIn);

      if (!isLoggedIn) {
        navigate('/login'); // Redirige si no está autenticado
      }
    };

    checkAuth();

    // Escucha cambios en localStorage
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate]);

  return isAuthenticated ? children : null; // Renderiza solo si está autenticado
};

export default PrivateRoute;
