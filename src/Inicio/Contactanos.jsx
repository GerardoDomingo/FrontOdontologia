import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, useTheme, TextField, Button } from '@mui/material';
import { Phone, Email, LocationOn, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Contactanos = () => {
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [empresa, setEmpresa] = useState({
    nombre_empresa: 'Nombre de la Empresa',
    slogan: 'Slogan de la empresa',
    telefono: 'Teléfono',
    correo_electronico: 'correo@ejemplo.com',
    direccion: 'Dirección'
  }); 
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="section"
        sx={{
          backgroundColor: isDarkMode ? '#0D1B2A' : '#f9f9f9',
          py: 8,
          px: 3,
          borderRadius: '16px',
          boxShadow: isDarkMode ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 3,
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
            color: isDarkMode ? '#ffffff' : '#000000',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Contáctanos
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            mb: 6
          }}
        >
          {/* Información de contacto */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: isDarkMode ? '#ffffff' : '#000000',
                mb: 3,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {empresa.nombre_empresa}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: isDarkMode ? '#94A3B8' : '#555555',
                mb: 3,
                fontStyle: 'italic'
              }}
            >
              {empresa.slogan}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton sx={{ color: theme.palette.primary.main }}><Phone /></IconButton>
              <Typography sx={{ color: isDarkMode ? '#94A3B8' : '#555555', ml: 1 }}>
                {empresa.telefono}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton sx={{ color: theme.palette.error.main }}><Email /></IconButton>
              <Typography sx={{ color: isDarkMode ? '#94A3B8' : '#555555', ml: 1 }}>
                {empresa.correo_electronico}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton sx={{ color: theme.palette.success.main }}><LocationOn /></IconButton>
              <Typography sx={{ color: isDarkMode ? '#94A3B8' : '#555555', ml: 1 }}>
                {empresa.direccion}
              </Typography>
            </Box>
          </Box>

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: isDarkMode ? '#2A3648' : '#ffffff',
              padding: 3,
              borderRadius: '8px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: isDarkMode ? '#ffffff' : '#000000',
                mb: 3,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              Envíanos un Mensaje
            </Typography>
            
            {['nombre', 'email', 'asunto'].map((field) => (
              <TextField
                key={field}
                fullWidth
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                variant="outlined"
                margin="normal"
                value={formData[field]}
                onChange={handleInputChange}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? '#2A3648' : '#ffffff',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#475569' : '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& input': {
                      color: isDarkMode ? '#ffffff' : '#000000',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#94A3B8' : '#666666',
                  },
                }}
              />
            ))}
            
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
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? '#2A3648' : '#ffffff',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#475569' : '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& textarea': {
                    color: isDarkMode ? '#ffffff' : '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#94A3B8' : '#666666',
                },
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Enviar Mensaje
            </Button>
          </Box>
        </Box>

        {/* Sección de citas */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 6,
            p: 4,
            backgroundColor: isDarkMode ? '#2A3648' : '#ffffff',
            borderRadius: '8px',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: isDarkMode ? '#ffffff' : '#000000',
              mb: 2,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            ¿Necesitas programar una cita?
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? '#94A3B8' : '#555555',
              mb: 3,
            }}
          >
            Agenda tu consulta con nuestros especialistas y recibe la mejor atención personalizada.
          </Typography>
          
          <Link to="/agendar-cita" style={{ textDecoration: 'none' }}>
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