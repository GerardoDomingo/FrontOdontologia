import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton } from '@mui/material';
import { Email, ArrowBack, Lock } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Recuperacion = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(''); // Para almacenar el código ingresado
  const [emailSent, setEmailSent] = useState(false); // Estado para saber si el email fue enviado
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value); // Capturar el código de verificación
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setErrorMessage('');
    setSuccessMessage('');
  
    if (!email) {
      setErrorMessage('Por favor, introduce un correo electrónico válido.');
      return;
    }
  
    console.log("Correo enviado al backend:", email);
  
    try {
      const response = await axios.post('http://localhost:3001/api/recuperacion', { email });
  
      if (response.status === 200) {
        setSuccessMessage('Se ha enviado un correo de recuperación. Por favor, revisa tu bandeja de entrada.');
        setEmailSent(true); // Cambia el estado para mostrar el campo del código
      } 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Correo no encontrado. Por favor, verifica el correo ingresado.');
      } else {
        setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
      }
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
  
    if (!token) {
      setErrorMessage('Por favor, introduce el código que te fue enviado.');
      return;
    }
  
    console.log("Verificando código:", token);
  
    try {
      // Enviar token y email al backend
      const response = await axios.post('http://localhost:3001/api/verifyTokene', { token, email });
  
      if (response.status === 200) {
        setSuccessMessage('Código verificado correctamente. Ahora puedes restablecer tu contraseña.');
        // Redirigir con el token a la página de cambiar contraseñaa
        navigate(`/resetContra?token=${encodeURIComponent(token)}`);
    }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Código inválido o expirado. Inténtalo de nuevo.');
      } else {
        setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
      }
    }
  };

  

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative'
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: 16, left: 16, color: '#00bcd4' }}
        component={Link}
        to="/login" // Ruta para regresar al login
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBack />
          <Typography
            variant="body2"
            sx={{ color: '#707070', opacity: 0.7, ml: 1 }}
          >
            Atrás
          </Typography>
        </Box>
      </IconButton>

      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: '15px', boxShadow: 3, position: 'relative' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            {emailSent ? 'Verificar Código' : 'Recuperar Contraseña'}
          </Typography>

          <Typography variant="body2" sx={{ mb: 4 }}>
            {emailSent ? 'Introduce el código que te enviamos por correo electrónico.' : 'Introduce el correo electrónico con el que te registraste para recibir un enlace de recuperación.'}
          </Typography>

          <form onSubmit={emailSent ? handleVerifyToken : handleSubmit}>
            {!emailSent ? (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton sx={{ mr: 1 }}>
                        <Email />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Código de Verificación"
                  name="token"
                  value={token}
                  onChange={handleTokenChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton sx={{ mr: 1 }}>
                        <Lock />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            )}

            {errorMessage && (
              <Typography
                variant="body2"
                sx={{
                  color: 'red',
                  textAlign: 'center',
                  mb: 3,
                  backgroundColor: '#ffe5e5',
                  p: 1,
                  borderRadius: '15px',
                }}
              >
                {errorMessage}
              </Typography>
            )}

            {successMessage && (
              <Typography
                variant="body2"
                sx={{
                  color: 'green',
                  textAlign: 'center',
                  mb: 3,
                  backgroundColor: '#e5ffe5',
                  p: 1,
                  borderRadius: '15px',
                }}
              >
                {successMessage}
              </Typography>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#00bcd4',
                '&:hover': { backgroundColor: '#00a3ba' },
                py: 1.5,
                fontSize: '16px',
              }}
            >
              {emailSent ? 'Verificar Código' : 'Enviar Enlace de Recuperación'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Recuperacion;
