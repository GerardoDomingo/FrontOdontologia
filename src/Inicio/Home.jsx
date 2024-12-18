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
  Button,
} from '@mui/material';
import { 
  CleaningServices, 
  MedicalServices, 
  LocalHospital 
} from '@mui/icons-material';

// Import images
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

import Contactanos from './Contactanos';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(true);
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerText, setHeaderText] = useState('Odontología Carol');

  const colors = {
    background: isDarkMode
      ? 'linear-gradient(135deg, #1A2A3A 30%, #1D2A38 100%)'
      : 'linear-gradient(135deg, #FFFFFF 30%, #E3F2FD 100%)',
    primaryText: isDarkMode ? '#82B1FF' : '#1976d2',
    secondaryText: isDarkMode ? '#B0BEC5' : '#616161',
    cardBackground: isDarkMode ? '#2A3A4A' : '#FFFFFF',
  };

  // Dynamic header text animation
  useEffect(() => {
    const texts = [
      'Odontología Carol', 
      'Sonrisas Brillantes', 
      'Tu Salud Dental', 
      'Cuidado Profesional'
    ];
    let currentIndex = 0;

    const changeText = () => {
      currentIndex = (currentIndex + 1) % texts.length;
      setHeaderText(texts[currentIndex]);
    };

    const textChangeInterval = setInterval(changeText, 3000);

    return () => clearInterval(textChangeInterval);
  }, []);

  // Previous useEffects remain the same...

  // Enhanced service card variants
  const serviceCardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50 
    },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: index * 0.3,
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
      transition: { duration: 0.3 }
    }
  };

  // Image hover effect variants
  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { 
        duration: 0.3,
        type: 'tween'
      }
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: colors.background,
        }}
      >
        <CircularProgress color="primary" size={80} />
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
          background: colors.background,
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
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={headerText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    color: colors.primaryText,
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  {headerText}
                </Typography>
              </motion.div>
            </AnimatePresence>
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

        {/* Services Section */}
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
                  whileHover="hover"
                  custom={index}
                >
                  <Card
                    sx={{
                      boxShadow: 3,
                      borderRadius: '16px',
                      height: '100%',
                      backgroundColor: colors.cardBackground,
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mt: 2 }}>{service.icon}</Box>
                    <motion.div
                      variants={imageVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <CardMedia
                        component="img"
                        alt={service.title}
                        image={service.img}
                        sx={{ 
                          height: 180, 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease-in-out',
                        }}
                      />
                    </motion.div>
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

        {/* Contact Section */}
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