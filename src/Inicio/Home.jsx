import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Fade,
} from '@mui/material';
import { 
  CleaningServices, 
  MedicalServices, 
  LocalHospital, 
  Phone, 
  Email, 
  StarBorder,
  CheckCircleOutline 
} from '@mui/icons-material';

// Local image imports
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme and data fetching logic remains the same as in the original component

  const colors = {
    background: isDarkMode
      ? 'linear-gradient(135deg, #121620 0%, #1A2A3A 100%)' // Deep, rich dark gradient
      : 'linear-gradient(135deg, #F0F4F8 0%, #FFFFFF 100%)', // Soft, clean light gradient
    primaryText: isDarkMode ? '#4FC3F7' : '#0288D1', // Vibrant, yet softer blue
    secondaryText: isDarkMode ? '#B0BEC5' : '#37474F', // Sophisticated gray
    cardBackground: isDarkMode ? '#1E2633' : '#FFFFFF', // Deeper card backgrounds
    cardHover: isDarkMode ? '#263238' : '#E1F5FE', // Refined hover effect
    accentColor: isDarkMode ? '#00BCD4' : '#03A9F4', // Accent for highlights
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
        <Fade in={true}>
          <CircularProgress color="primary" size={60} thickness={4} />
        </Fade>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: colors.background,
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography 
          color="error" 
          variant="h4" 
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Ups, algo salió mal
        </Typography>
        <Typography variant="body1" sx={{ color: colors.secondaryText }}>
          {error || 'No pudimos cargar la información'}
        </Typography>
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
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
        {/* Enhanced Header */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 10, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              color: colors.primaryText,
              fontFamily: 'Montserrat, sans-serif',
              mb: 2,
              letterSpacing: -1,
              maxWidth: 600,
            }}
          >
            {empresa?.nombre_empresa || 'Clínica Odontológica'}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: colors.secondaryText,
              fontFamily: 'Roboto, sans-serif',
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            {empresa?.slogan || 'Transformando sonrisas con cuidado profesional'}
          </Typography>
        </Box>

        {/* Services Section with Enhanced Design */}
        <Box component="section" sx={{ mb: 12 }}>
          <Typography
            variant="h4"
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 8,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Nuestros Servicios Especializados
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: 'Limpieza Dental Profunda',
                icon: <CleaningServices sx={{ fontSize: 50, color: colors.accentColor }} />,
                img: img1,
                description: 'Limpieza meticulosa que garantiza una sonrisa brillante y saludable.',
              },
              {
                title: 'Ortodoncia Personalizada',
                icon: <MedicalServices sx={{ fontSize: 50, color: colors.accentColor }} />,
                img: img2,
                description: 'Tratamientos de ortodoncia adaptados a tu anatomía única.',
              },
              {
                title: 'Implantes de Precisión',
                icon: <LocalHospital sx={{ fontSize: 50, color: colors.accentColor }} />,
                img: img3,
                description: 'Implantes de última generación para una sonrisa natural y duradera.',
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: isDarkMode 
                      ? '0 8px 32px rgba(0,0,0,0.4)' 
                      : '0 8px 32px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    backgroundColor: colors.cardBackground,
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: isDarkMode 
                        ? '0 12px 40px rgba(0,0,0,0.5)' 
                        : '0 12px 40px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      p: 3,
                      background: isDarkMode 
                        ? 'linear-gradient(145deg, #1E2633, #17202A)' 
                        : 'linear-gradient(145deg, #F0F4F8, #FFFFFF)' 
                    }}
                  >
                    {service.icon}
                  </Box>
                  
                  <CardMedia
                    component="img"
                    alt={service.title}
                    image={service.img}
                    sx={{
                      height: 220,
                      width: '100%',
                      objectFit: 'cover',
                      filter: isDarkMode ? 'brightness(0.8)' : 'none',
                    }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: colors.primaryText,
                        mb: 2,
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: colors.secondaryText,
                        lineHeight: 1.6,
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section with Improved Layout */}
        <Box
          component="section"
          sx={{
            backgroundColor: colors.cardBackground,
            borderRadius: '16px',
            boxShadow: isDarkMode 
              ? '0 12px 40px rgba(0,0,0,0.3)' 
              : '0 12px 40px rgba(0,0,0,0.1)',
            p: { xs: 3, md: 6 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.primaryText,
              fontWeight: 'bold',
              mb: 4,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Contáctanos
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: colors.accentColor, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: colors.secondaryText }}>
                    {empresa?.telefono || 'No disponible'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: colors.accentColor, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: colors.secondaryText }}>
                    {empresa?.correo_electronico || 'No disponible'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleOutline sx={{ color: colors.accentColor, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: colors.secondaryText }}>
                    {empresa?.direccion || 'No disponible'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StarBorder sx={{ color: colors.accentColor, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: colors.secondaryText }}>
                    Dr. Hugo Gómez Ramírez
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;