import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import { 
  CleaningServices, 
  MedicalServices, 
  LocalHospital,
  NavigateBefore,
  NavigateNext 
} from '@mui/icons-material';

// Importar imágenes locales
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

// Importar componente Contactanos
import Contactanos from './Contactanos';
import Preguntas from './Preguntas';


const Home = () => {
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(true);
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeService, setActiveService] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(0);

  const titles = [
    "Odontología Carol",
    "Sonrisas Perfectas",
    "Expertos Dentales",
    "Tu Clínica de Confianza"
  ];

  const colors = {
    background: isDarkMode
      ? 'linear-gradient(135deg, #1A2A3A 30%, #1D2A38 100%)'
      : 'linear-gradient(135deg, #FFFFFF 30%, #E3F2FD 100%)',
    primaryText: isDarkMode ? '#82B1FF' : '#1976d2',
    secondaryText: isDarkMode ? '#B0BEC5' : '#616161',
    cardBackground: isDarkMode ? '#2A3A4A' : '#FFFFFF',
  };

  const services = [
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
  ];

  // Título rotativo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotación de servicios
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        const response = await fetch('https://backendodontologia.onrender.com/api/perfilEmpresa/empresa');
        if (!response.ok) throw new Error('Error al obtener los datos de la empresa');
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

  const handlePrevService = () => {
    setActiveService((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleNextService = () => {
    setActiveService((prev) => (prev + 1) % services.length);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: colors.background, minHeight: '100vh', margin: 0, padding: 0 }}>
      <Container maxWidth="lg" sx={{ py: 10 }} disableGutters>
        {/* Header con animación de títulos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
                {titles[currentTitle]}
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
        </AnimatePresence>

        {/* Servicios con carrusel */}
        <Box component="section" sx={{ mb: 12, position: 'relative' }}>
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

          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={handlePrevService}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              <NavigateBefore />
            </IconButton>

            <IconButton
              onClick={handleNextService}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              <NavigateNext />
            </IconButton>

            <AnimatePresence mode="wait">
              <Grid container spacing={4} justifyContent="center">
                {services.map((service, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: index === activeService ? 1.05 : 0.95,
                      }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{
                        duration: 0.5,
                        scale: { duration: 0.3 },
                      }}
                    >
                      <Card
                        sx={{
                          boxShadow: index === activeService ? 8 : 3,
                          borderRadius: '16px',
                          height: '100%',
                          backgroundColor: colors.cardBackground,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: 8,
                          },
                        }}
                      >
                        <Box sx={{ textAlign: 'center', mt: 2 }}>{service.icon}</Box>
                        <CardMedia
                          component="img"
                          alt={service.title}
                          image={service.img}
                          sx={{
                            height: 180,
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
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
            </AnimatePresence>
          </Box>
        </Box>

        {/* Sección de contacto */}
        {isContactLoading && (
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <CircularProgress />
          </Box>
        )}
        <Contactanos colors={colors} onLoading={setIsContactLoading} />
        </Container>
    </Box>
  );
};

export default Home;