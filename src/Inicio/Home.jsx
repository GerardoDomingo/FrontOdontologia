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
} from '@mui/material';
import { CleaningServices, MedicalServices, LocalHospital, Phone, Email } from '@mui/icons-material';

// Importar las imágenes locales
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [empresa, setEmpresa] = useState(null); // Estado para guardar los datos de la empresa
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

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

  // Obtener los datos de la empresa desde el backend
  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const response = await fetch('https://backendodontologia.onrender.com/api/perfilEmpresa/empresa');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la empresa');
        }
        const data = await response.json();
        setEmpresa(data); // Guardar los datos en el estado
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Cambiar el estado de carga
      }
    };

    fetchEmpresaData();
  }, []);

  const colors = {
    background: isDarkMode
      ? 'linear-gradient(135deg, #1A2A3A 30%, #1D2A38 100%)' // Gradiente en modo oscuro
      : 'linear-gradient(135deg, #FFFFFF 30%, #E3F2FD 100%)', // Gradiente en modo claro
    primaryText: isDarkMode ? '#82B1FF' : '#1976d2', // Azul brillante en oscuro
    secondaryText: isDarkMode ? '#B0BEC5' : '#616161', // Gris claro en oscuro
    cardBackground: isDarkMode ? '#2A3A4A' : '#FFFFFF', // Fondo de tarjeta oscuro en modo oscuro
    cardHover: isDarkMode ? '#3A4A5A' : '#E3F2FD', // Fondo de tarjeta al pasar el ratón
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
      </Container>
    </Box>
  );
};

export default Home;
