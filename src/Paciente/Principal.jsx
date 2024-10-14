import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Principal = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes implementar la lógica para cerrar sesión
    // Por ejemplo, eliminar tokens o limpiar localStorage
    navigate('/login');
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Bienvenido a la página principal
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Aquí puedes acceder a las distintas funcionalidades de la plataforma.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Volver a la Página de Inicio
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </Button>
    </Box>
  );
};

export default Principal;
