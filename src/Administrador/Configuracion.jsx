import React, { useState } from 'react';
import { Box, Typography, Button, Tab, Tabs, Card, CardContent, IconButton } from '@mui/material';
import { FaUserShield, FaFileAlt, FaExclamationTriangle, FaFileContract, FaBuilding } from 'react-icons/fa'; // Íconos
import AvisoDePrivacidad from './AvisoPriva';
import DeslindeLegal from './DeslindeLegal';
import TerminosCondiciones from './TermiCondicion';
import { Link } from 'react-router-dom';

const Configuracion = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Estado para la pestaña seleccionada

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 30%, #f9f9f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#1976d2',
          fontFamily: 'Roboto, sans-serif',
          textAlign: 'center',
        }}
      >
        Configuración de la Empresa
      </Typography>

      {/* Pestañas con íconos */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{
          mb: 4,
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
            transition: '0.3s',
          },
          '& .Mui-selected': {
            color: '#1565c0 !important',
          },
        }}
      >
        <Tab
          label="Aviso de Privacidad"
          icon={<FaFileAlt />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
        <Tab
          label="Deslinde Legal"
          icon={<FaExclamationTriangle />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
        <Tab
          label="Términos y Condiciones"
          icon={<FaFileContract />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
      </Tabs>

      {/* Renderizado condicional según la pestaña seleccionada */}
      <Card
        sx={{
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          transition: 'all 0.5s ease',
        }}
      >
        <CardContent>
          {selectedTab === 0 && <AvisoDePrivacidad />}
          {selectedTab === 1 && <DeslindeLegal />}
          {selectedTab === 2 && <TerminosCondiciones />}
        </CardContent>
      </Card>

      {/* Botón flotante para ir al perfil de la empresa */}
      <IconButton
        component={Link}
        to="/Administrador/PerfilEmpresa"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
          p: 2,
          borderRadius: '50%',
        }}
      >
        <FaBuilding size={24} />
      </IconButton>
    </Box>
  );
};

export default Configuracion;
