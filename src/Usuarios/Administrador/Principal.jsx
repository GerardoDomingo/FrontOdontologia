import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Settings, Assessment, Business } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Principal = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #1976d2, #42a5f5)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: '20px', sm: '40px' },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#fff',
            letterSpacing: 1,
            fontSize: { xs: '1.6rem', sm: '2.2rem', md: '2.4rem' }, // Tamaño de texto responsivo
          }}
        >
          Panel Administrativo de Odontología Carol
        </Typography>
        <Typography variant="body1" sx={{ color: '#e3f2fd', mb: { xs: 4, sm: 6 } }}>
          Accede a las distintas funcionalidades de la plataforma.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Tarjeta de Configuración */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              boxShadow: 6,
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 10,
                transform: 'scale(1.05)', // Efecto más sutil en móviles
              },
              backgroundColor: '#fff',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Settings
                sx={{
                  fontSize: { xs: 40, sm: 50, md: 60 }, // Icono más pequeño en móviles
                  color: '#1976d2',
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': { opacity: 0.8 },
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242', fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
                Configuración
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Modifica las configuraciones generales del sistema.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                onClick={() => navigate('/Usuarios/Administrador/configuracion')}
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
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 10,
                transform: 'scale(1.05)',
              },
              backgroundColor: '#fff',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment
                sx={{
                  fontSize: { xs: 40, sm: 50, md: 60 },
                  color: '#1976d2',
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': { opacity: 0.8 },
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242', fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
                Reportes
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Consulta los reportes de actividad y rendimiento.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                onClick={() => navigate('/Usuarios/Administrador/reportes')}
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
              borderRadius: '16px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: 10,
                transform: 'scale(1.05)',
              },
              backgroundColor: '#fff',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Business
                sx={{
                  fontSize: { xs: 40, sm: 50, md: 60 },
                  color: '#1976d2',
                  mb: 2,
                  transition: '0.3s',
                  '&:hover': { opacity: 0.8 },
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#424242', fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
                Perfil de Empresa
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Gestiona la información y el perfil de tu empresa.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold', borderRadius: '0 0 16px 16px', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                onClick={() => navigate('/Usuarios/Administrador/PerfilEmpresa')}
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
