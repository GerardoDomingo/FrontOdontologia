import React, { useState } from 'react';
import { Box, Typography, Button, Tab, Tabs, Card, CardContent } from '@mui/material';
import { FaUserShield, FaFileAlt, FaExclamationTriangle, FaFileContract } from 'react-icons/fa'; // Íconos
import AvisoDePrivacidad from './AvisoPriva';
import DeslindeLegal from './DeslindeLegal';
import TerminosCondiciones from './TermiCondicion';

const Configuracion = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Estado para la pestaña seleccionada

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
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
        Configuración
      </Typography>

      {/* Pestañas con íconos */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 1 }}
      >
        <Tab
          label="Aviso de Privacidad"
          icon={<FaFileAlt />}
          sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
        />
        <Tab
          label="Deslinde Legal"
          icon={<FaExclamationTriangle />}
          sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
        />
        <Tab
          label="Términos y Condiciones"
          icon={<FaFileContract />}
          sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
        />
      </Tabs>

      {/* Renderizado condicional según la pestaña seleccionada */}
      <Card sx={{ boxShadow: 3, borderRadius: '16px' }}>
        <CardContent>
          {selectedTab === 0 && <AvisoDePrivacidad />}
          {selectedTab === 1 && <DeslindeLegal />}
          {selectedTab === 2 && <TerminosCondiciones />}
        </CardContent>
      </Card>

    </Box>
  );
};

export default Configuracion;
