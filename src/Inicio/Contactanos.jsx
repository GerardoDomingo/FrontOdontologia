import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, useTheme, TextField, Button } from '@mui/material';
import { Phone, Email, LocationOn, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Contactanos = () => {
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);
    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
  }, []);

  // Fetch datos de la empresa
  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await fetch(
          'https://backendodontologia.onrender.com/api/perfilEmpresa/empresa'
        );
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la empresa');
        }
        const data = await response.json();
        setEmpresa(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpresaData();
  }, []);

  const colors = {
    cardBackground: isDarkMode ? '#121212' : '#f9f9f9',
    primaryText: isDarkMode ? '#ffffff' : '#000000',
    secondaryText: isDarkMode ? '#aaaaaa' : '#555555',
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí puedes agregar la lógica para enviar el formulario
  };

  if (isLoading) {
    return null;
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="section"
        sx={{
          backgroundColor: colors.cardBackground,
          py: 8,
          px: 3,
          borderRadius: '16px',
          boxShadow: 3,
          mb: 5,
          maxWidth: '900px',
          mx: 'auto',
          [theme.breakpoints.down('sm')]: {
            py: 5,
            px: 2,
          },
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

        {/* Contact Information Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            mb: 6
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: colors.primaryText,
                mb: 3,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {empresa.nombre_empresa}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: colors.secondaryText,
                mb: 3,
                fontStyle: 'italic'
              }}
            >
              {empresa.slogan}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton color="primary"><Phone /></IconButton>
              <Typography sx={{ color: colors.secondaryText }}>{empresa.telefono}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton color="primary"><Email /></IconButton>
              <Typography sx={{ color: colors.secondaryText }}>{empresa.correo_electronico}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton color="primary"><LocationOn /></IconButton>
              <Typography sx={{ color: colors.secondaryText }}>{empresa.direccion}</Typography>
            </Box>
          </Box>

          {/* Contact Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              sx={{
                color: colors.primaryText,
                mb: 3,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Envíanos un Mensaje
            </Typography>
            
            <TextField
              fullWidth
              name="nombre"
              label="Nombre"
              variant="outlined"
              margin="normal"
              value={formData.nombre}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              name="email"
              label="Correo Electrónico"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              name="asunto"
              label="Asunto"
              variant="outlined"
              margin="normal"
              value={formData.asunto}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              name="mensaje"
              label="Mensaje"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              value={formData.mensaje}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Enviar Mensaje
            </Button>
          </Box>
        </Box>

        {/* Appointment Section */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            p: 4,
            backgroundColor: isDarkMode ? '#1A1A1A' : '#f0f0f0',
            borderRadius: '8px',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: colors.primaryText,
              mb: 2,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            ¿Necesitas programar una cita?
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: colors.secondaryText,
              mb: 3,
            }}
          >
            Agenda tu consulta con nuestros especialistas y recibe la mejor atención personalizada.
          </Typography>
          
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Schedule />}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              Programar Cita
            </Button>
          </Link>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Contactanos;