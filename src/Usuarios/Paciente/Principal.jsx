import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { CalendarToday, Healing, History } from '@mui/icons-material'; // Iconos para las secciones
import { useNavigate } from 'react-router-dom';

const Principal = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#e3f2fd', // Azul claro para el fondo
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: '20px', sm: '40px' }, // Ajustar el padding según el tamaño de la pantalla
      }}
    >
      <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#1976d2', // Azul primario
            letterSpacing: 1,
            fontSize: { xs: '1.8rem', sm: '2.4rem' }, // Ajuste de tamaño de texto para pantallas pequeñas
          }}
        >
          Bienvenido a Odontología Carol
        </Typography>
        <Typography variant="body1" sx={{ color: '#616161', mb: { xs: 4, sm: 6 } }}>
          Aquí puedes gestionar tus citas, ver tus tratamientos y consultar tu historial médico.
        </Typography>
      </Box>

      {/* Grid para organizar las tarjetas de las secciones */}
      <Grid container spacing={4} justifyContent="center">
        {/* Tarjeta de Citas */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: '20px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.05)', // Efecto de zoom al pasar el ratón
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                Citas
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Gestiona tus próximas citas con facilidad.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate('/Usuarios/Paciente/citas')}
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px' }}
              >
                Ver Citas
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Tarjeta de Tratamientos */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: '20px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Healing sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                Tratamientos
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Consulta tus tratamientos actuales y pasados.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate('/Usuarios/Paciente/tratamientos')}
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px' }}
              >
                Ver Tratamientos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Tarjeta de Historial Médico */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: '20px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <History sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                Historial Médico
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Consulta tu historial médico y documentos.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate('/Usuarios/Paciente/historial')}
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px' }}
              >
                Ver Historial
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Principal;
