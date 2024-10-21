import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton, InputAdornment } from '@mui/material';
import { FaTooth } from 'react-icons/fa';
import { Email, Lock, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate, Link } from 'react-router-dom';
import Notificaciones from '../Compartidos/Notificaciones';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // Almacenar el token CSRF
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // Obtener el token CSRF al montar el componente
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://backendodontologia.onrender.com/api/csrf-token', {
          method: 'GET',
          credentials: 'include',  // Importante para incluir las cookies de sesión
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);  // Guarda el token en el estado
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };

    fetchCsrfToken();
}, []);

  // Eliminar mensaje de error después de 3 segundos
  useEffect(() => {
    let errorTimeout;
    if (errorMessage) {
      errorTimeout = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
    return () => clearTimeout(errorTimeout);
  }, [errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!captchaValue) {
      setErrorMessage('Por favor, completa el captcha.');
      return;
    }
  
    try {
      const response = await fetch('https://backendodontologia.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,  // Asegúrate de enviar el token CSRF aquí
        },
        body: JSON.stringify({ ...formData, captchaValue }),
        credentials: 'include', // Asegúrate de que las cookies de sesión se envíen
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.user.tipo === 'administrador') {
          navigate('/Administrador/principal');
        } else if (data.user.tipo === 'paciente') {
          navigate('/Paciente/principal');
        }
      } else {
        setNotificationMessage(`Intentos fallidos: ${data.failedAttempts || 0}`);
        setOpenNotification(true);
        recaptchaRef.current.reset();
        setCaptchaValue(null);
        setErrorMessage(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
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
        to="/"
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBack />
          <Typography variant="body2" sx={{ color: '#707070', opacity: 0.7, ml: 1 }}>
            Atrás
          </Typography>
        </Box>
      </IconButton>

      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: '15px', boxShadow: 3, position: 'relative' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <IconButton sx={{ fontSize: 40, color: '#00bcd4' }}>
            <FaTooth />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Iniciar Sesión
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                value={formData.email}
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

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <IconButton sx={{ mr: 1 }}>
                      <Lock />
                    </IconButton>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Lc74mAqAAAAAL5MmFjf4x0PWP9MtBNEy9ypux_h"
                onChange={handleCaptchaChange}
              />
            </Box>

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
              disabled={!captchaValue}  // Deshabilitar el botón si no se ha resuelto el captcha
            >
              Iniciar Sesión
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                <Link to="/register" style={{ color: '#00bcd4', textDecoration: 'none' }}>
                  ¿No tienes cuenta? Registrarte
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <Link to="/recuperacion" style={{ color: '#00bcd4', textDecoration: 'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Notificaciones
        open={openNotification}
        message={notificationMessage}
        type="warning"
        handleClose={handleCloseNotification}
      />
    </Box>
  );
};

export default Login;
