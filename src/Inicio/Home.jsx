import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { CleaningServices, MedicalServices, LocalHospital } from '@mui/icons-material';

// Importar imágenes locales
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

// Importar componente Contactanos
import Contactanos from './Contactanos';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(true);
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    background: isDarkMode
      ? 'linear-gradient(135deg, #1A2A3A 30%, #1D2A38 100%)'
      : 'linear-gradient(135deg, #FFFFFF 30%, #E3F2FD 100%)',
    primaryText: isDarkMode ? '#82B1FF' : '#1976d2',
    secondaryText: isDarkMode ? '#B0BEC5' : '#616161',
    cardBackground: isDarkMode ? '#2A3A4A' : '#FFFFFF',
  };

  // Detectar el tema del sistema
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Obtener datos de la empresa desde el backend
  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await fetch('https://backendodontologia.onrender.com/api/perfilEmpresa/empresa');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la empresa');
        }
        const data = await response.json();
        setEmpresa(data); // Guardar los datos de la empresa en el estado
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Dejar de mostrar el indicador de carga
      }
    };

    fetchEmpresaData();
  }, []);

  // Variantes de animación para servicioss
  const serviceCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.5,
        type: 'spring',
        stiffness: 120,
      },
    }),
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: colors.background,
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 10 }} disableGutters>
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: colors.primaryText,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {empresa?.nombre_empresa || 'Odontología'}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: colors.secondaryText,
                mt: 2,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {empresa?.slogan || 'Cuidando tu sonrisa con pasión y profesionalismo'}
            </Typography>
          </Box>
        </motion.div>

        {/* Sección de servicios */}
        <Box component="section" sx={{ mb: 12 }}>
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
            Nuestros Servicios
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: 'Limpieza Dental',
                icon: <CleaningServices sx={{ fontSize: 40, color: colors.primaryText }} />,
                img: img1,
                description: 'Mantenemos tu sonrisa limpia y saludable.',
              },
              {
                title: 'Ortodoncia',
                icon: <MedicalServices sx={{ fontSize: 40, color: colors.primaryText }} />,
                img: img2,
                description: 'Corrige la posición de tus dientes.',
              },
              {
                title: 'Implantes Dentales',
                icon: <LocalHospital sx={{ fontSize: 40, color: colors.primaryText }} />,
                img: img3,
                description: 'Reemplaza tus dientes faltantes con implantes de calidad.',
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={serviceCardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <Card
                    sx={{
                      boxShadow: 3,
                      borderRadius: '16px',
                      height: '100%',
                      backgroundColor: colors.cardBackground,
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mt: 2 }}>{service.icon}</Box>
                    <CardMedia
                      component="img"
                      alt={service.title}
                      image={service.img}
                      sx={{ height: 180, objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h5" sx={{ color: colors.secondaryText, mb: 2 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.secondaryText }}>
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Indicador de carga mientras Contactanos.jsx obtiene los datos */}
        {isContactLoading && (
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Sección Contáctanos */}
        <Contactanos colors={colors} onLoading={setIsContactLoading} />
      </Container>
    </Box>
  );
};

export default Home;
