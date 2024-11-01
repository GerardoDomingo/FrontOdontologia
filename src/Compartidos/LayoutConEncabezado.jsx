// LayoutConEncabezado.js
import React from 'react';
import { Box } from '@mui/material';
import BarraNav from './barraNav';
import PieDePagina from './Footer';

const LayoutConEncabezado = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Asegura que ocupe toda la altura de la pantalla
      }}
    >
      <Box component="header">
        <BarraNav />
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1, // Hace que el main ocupe todo el espacio disponible
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          backgroundColor: '#00bcd4',
          color: '#ffffff',
          p: 2, // Padding para el footer
          textAlign: 'center',
        }}
      >
        <PieDePagina />
      </Box>
    </Box>
  );
}

export default LayoutConEncabezado;
