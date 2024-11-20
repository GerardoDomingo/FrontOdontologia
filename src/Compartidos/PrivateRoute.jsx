import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn'); // Revisa si el usuario está logueado
    if (!isLoggedIn) {
      navigate('/login'); // Redirige al login si no está logueado
    }
  }, [navigate]);

  return children; // Si está logueado, renderiza el contenido de la ruta protegida
};

export default PrivateRoute;
