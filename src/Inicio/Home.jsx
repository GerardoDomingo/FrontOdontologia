import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CleaningServices, MedicalServices, LocalHospital, Phone, Email } from '@mui/icons-material'; // Importación correcta de iconos

// Importar las imágenes locales
import img1 from '../img/img1_1.jpeg';
import img2 from '../img/img2_1.jpg';
import img3 from '../img/img3_1.png';

const Home = () => {
  const theme = useTheme(); // Hook para acceder al tema actual (claro u oscuro)

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Encabezado principal */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main, // Usamos el color principal del tema
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Bienvenido a Odontología Carol
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
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
            color: theme.palette.primary.main,
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
              icon: <CleaningServices sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
              img: img1, // Usamos la imagen importada
              description: 'Mantenemos tu sonrisa limpia y saludable.',
            },
            {
              title: 'Ortodoncia',
              icon: <MedicalServices sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
              img: img2, // Usamos la imagen importada
              description: 'Corrige la posición de tus dientes.',
            },
            {
              title: 'Implantes Dentales',
              icon: <LocalHospital sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
              img: img3, // Usamos la imagen importada
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
                  transition: '0.3s',
                  backgroundColor: theme.palette.background.paper, // Dependiendo del tema
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <Box sx={{ textAlign: 'center', mt: 2 }}>{service.icon}</Box> {/* Mostrar icono */}
                <CardMedia
                  component="img"
                  alt={service.title}
                  image={service.img} // Asegúrate de reemplazar con las rutas correctas
                  sx={{
                    height: 180, // Forzamos la altura de la imagen
                    width: '100%',
                    objectFit: 'cover', // Aseguramos que las imágenes se ajusten
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                      mb: 2,
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Sección de testimonios */}
      <Box
        component="section"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5', // Diferente color según el tema
          py: 8,
          borderRadius: '16px',
          mb: 12,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Testimonios de Nuestros Pacientes
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              text: '"El mejor servicio dental que he recibido, el equipo es muy profesional y me sentí muy cómoda durante todo el proceso."',
              author: 'María López',
            },
            {
              text: '"Gracias a Odontología Carol ahora tengo una sonrisa perfecta. Estoy muy agradecido por su trabajo."',
              author: 'Juan Pérez',
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} md={5} key={index}>
              <Box
                sx={{
                  p: 4,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '16px',
                  boxShadow: 3,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontStyle: 'italic', color: theme.palette.text.primary, mb: 2 }}
                >
                  {testimonial.text}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  - {testimonial.author}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Sección de contacto */}
      <Box
        component="section"
        sx={{
          backgroundColor: theme.palette.background.default,
          py: 8,
          borderRadius: '16px',
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 6,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Contáctanos
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, textAlign: 'center', mb: 3 }}>
          Visítanos en nuestra clínica o llámanos para agendar tu cita.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <IconButton color="primary">
            <Phone />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, fontFamily: 'Roboto, sans-serif', mb: 2 }}
          >
            <strong>Teléfono:</strong> (555) 123-4567
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
          <IconButton color="primary">
            <Email />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, fontFamily: 'Roboto, sans-serif' }}
          >
            <strong>Email:</strong> contacto@odontologiacarol.com
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
