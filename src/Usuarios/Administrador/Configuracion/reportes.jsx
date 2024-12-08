import React, { useState, useEffect } from 'react';
import { Box, Typography, Tab, Tabs, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import { FaSignInAlt, FaFileAlt, FaUserFriends } from 'react-icons/fa'; // Íconos
import LoginAttemptsReport from './LoginAttemptsReport'; // Reporte de intentos de login
import LogsReport from './LogsReport'; // Reporte de logs
import PatientsReport from './PatientsReport.jsx'; // Reporte de pacientes (nuevo)
import { Link } from 'react-router-dom';

const Reportes = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Estado para la pestaña seleccionada
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga

  // Manejar el cambio de pestaña y mostrar "Cargando" por 2 segundos
  const handleTabChange = (event, newValue) => {
    setLoading(true); // Activar estado de carga
    setSelectedTab(newValue);

    // Simular carga de 2 segundos antes de mostrar el contenido
    setTimeout(() => {
      setLoading(false); // Desactivar estado de carga después de 2 segundos
    }, 2000);
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
        Reportes del Sistema
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
          label="Intentos de Login"
          icon={<FaSignInAlt />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
        <Tab
          label="Auditoría del Sistema"
          icon={<FaFileAlt />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
        <Tab
          label="Modulo de Pacientes" // Nueva pestaña
          icon={<FaUserFriends />}
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
          {loading ? (
            // Mostrar el indicador de carga cuando loading es true
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Cargando...
              </Typography>
            </Box>
          ) : (
            // Mostrar el contenido del reporte cuando loading es false
            <>
              {selectedTab === 0 && <LoginAttemptsReport />}
              {selectedTab === 1 && <LogsReport />}
              {selectedTab === 2 && <PatientsReport />} {/* Nuevo contenido para Pacientes */}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reportes;
