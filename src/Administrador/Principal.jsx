import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Settings, Assessment, Business } from '@mui/icons-material'; // Iconos para los botones
import { useNavigate } from 'react-router-dom';

const Principal = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #1976d2, #42a5f5)', // Gradiente de fondo
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#fff', // Texto blanco
            letterSpacing: 1, // Espaciado de letras para estilo
          }}
        >
          Panel Administrativo de Odontología Carol
        </Typography>
        <Typography variant="body1" sx={{ color: '#e3f2fd', mb: 6 }}>
          Accede a las distintas funcionalidades de la plataforma.
        </Typography>
      </Box>

      {/* Grid para organizar las tarjetas de las secciones */}
      <Grid container spacing={4} justifyContent="center">
        {/* Tarjeta de Configuración */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 6,
              borderRadius: '20px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 10,
                transform: 'scale(1.07)', // Efecto de zoom al pasar el ratón
              },
              backgroundColor: '#fff',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Settings
                sx={{
                  fontSize: 60,
                  color: '#1976d2',
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': { opacity: 0.8 }, // Opacidad en hover
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242' }}>
                Configuración
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Modifica las configuraciones generales del sistema.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px' }}
                onClick={() => navigate('/Administrador/configuracion')}
              >
                Ir a Configuración
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Tarjeta de Reportes */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 6,
              borderRadius: '20px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 10,
                transform: 'scale(1.07)',
              },
              backgroundColor: '#fff',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment
                sx={{
                  fontSize: 60,
                  color: '#1976d2',
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': { opacity: 0.8 },
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242' }}>
                Reportes
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Consulta los reportes de actividad y rendimiento.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px' }}
                onClick={() => navigate('/Administrador/reportes')}
              >
                Ver Reportes
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Tarjeta de Perfil de Empresa */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 6,
              borderRadius: '20px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 10,
                transform: 'scale(1.07)',
              },
              backgroundColor: '#fff',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Business
                sx={{
                  fontSize: 60,
                  color: '#1976d2',
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': { opacity: 0.8 },
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242' }}>
                Perfil de Empresa
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Gestiona la información y el perfil de tu empresa.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px' }}
                onClick={() => navigate('/Administrador/PerfilEmpresa')}
              >
                Ver Perfil
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Principal;
