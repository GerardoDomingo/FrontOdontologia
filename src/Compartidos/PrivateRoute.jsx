import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children, ...rest }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Cargando...</p>; // Mostrar un indicador de carga mientras verificamos la autenticación
  }

  return user ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
