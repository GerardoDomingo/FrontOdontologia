import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { Phone, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Contactanos = ({ colors, onLoading }) => {
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variantes de animación
  const contactSectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await fetch('https://backendodontologia.onrender.com/api/perfilEmpresa/empresa');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la empresa');
        }
        const data = await response.json();
        setEmpresa(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
        onLoading(false); // Notifica que la carga terminó
      }
    };

    onLoading(true); // Notifica que la carga empezó
    fetchEmpresaData();
  }, [onLoading]);

  if (isLoading) {
    return null; // Mientras carga, Home muestra el ícono de carga
  }

  if (error) {
    return (
      <Typography variant="body2" sx={{ color: 'red', textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return (
    <motion.div
      variants={contactSectionVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        component="section"
        sx={{
          backgroundColor: colors.cardBackground,
          py: 8,
          borderRadius: '16px',
          boxShadow: 3,
          mb: 5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: colors.primaryText,
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Contáctanos
        </Typography>
        <Typography variant="body1" sx={{ color: colors.secondaryText, textAlign: 'center', mb: 3 }}>
          Visítanos en nuestra clínica o llámanos para agendar tu cita.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <IconButton color="primary" sx={{ fontSize: 40 }}>
            <Phone />
          </IconButton>
          <Typography variant="body2" sx={{ color: colors.secondaryText, fontFamily: 'Roboto, sans-serif' }}>
            <strong>Teléfonos:</strong> {empresa?.telefono || 'No disponible'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
          <IconButton color="primary" sx={{ fontSize: 40 }}>
            <Email />
          </IconButton>
          <Typography variant="body2" sx={{ color: colors.secondaryText, fontFamily: 'Roboto, sans-serif' }}>
            <strong>Email:</strong> {empresa?.correo_electronico || 'No disponible'}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: colors.secondaryText, textAlign: 'center', mt: 3 }}>
          <strong>Ubicación:</strong> {empresa?.direccion || 'No disponible'}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.secondaryText, textAlign: 'center', mt: 1 }}>
          <strong>Dueño:</strong> Hugo Gómez Ramírez
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Contactanos;
