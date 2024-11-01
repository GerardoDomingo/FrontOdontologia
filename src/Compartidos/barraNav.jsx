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
} from '@mui/material';
import { CleaningServices, MedicalServices, LocalHospital, Phone, Email } from '@mui/icons-material';

// Importar las imágenes locales
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const colors = {
    background: isDarkMode ? '#1A2A3A' : 'linear-gradient(135deg, #FFFFFF 30%, #E3F2FD 100%)', // Gris azulado oscuro en modo oscuro
    primaryText: isDarkMode ? '#82B1FF' : '#1976d2', // Azul brillante en oscuro
    secondaryText: isDarkMode ? '#B0BEC5' : '#616161', // Gris claro en oscuro
    cardBackground: isDarkMode ? '#2A3A4A' : '#FFFFFF', // Fondo de tarjeta oscuro en modo oscuro
    cardHover: isDarkMode ? '#3A4A5A' : '#E3F2FD', // Fondo de tarjeta al pasar el ratón
  };
  
  return (
    <Box
      sx={{
        background: colors.background,
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Encabezado principal */}
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
            Odontología Carol
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: colors.secondaryText,
              mt: 2,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            Cuidando tu sonrisa con pasión y profesionalismo
          </Typography>
        </Box>

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
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    backgroundColor: colors.cardBackground,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.05)', // Animación de zoom al pasar el ratón
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
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: colors.secondaryText,
                        mb: 2,
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.secondaryText }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sección de contacto */}
        <Box
          component="section"
          sx={{
            backgroundColor: colors.cardBackground,
            py: 8,
            borderRadius: '16px',
            boxShadow: 3,
            mb: 20,
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
              <strong>Teléfonos:</strong> 5582758840, 7713339456
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
            <IconButton color="primary" sx={{ fontSize: 40 }}>
              <Email />
            </IconButton>
            <Typography variant="body2" sx={{ color: colors.secondaryText, fontFamily: 'Roboto, sans-serif' }}>
              <strong>Email:</strong> e_gr@hotmail.com
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.secondaryText, textAlign: 'center', mt: 3 }}>
            <strong>Ubicación:</strong> Ixcatlán, Huejutla de Reyes, Hidalgo, México
          </Typography>
          <Typography variant="body2" sx={{ color: colors.secondaryText, textAlign: 'center', mt: 1 }}>
            <strong>Dueño:</strong> Hugo Gómez Ramírez
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
