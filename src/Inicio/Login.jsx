import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton, InputAdornment, CircularProgress } from '@mui/material';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

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

  // Eliminar notificación después de 3 segundos
  useEffect(() => {
    if (openNotification) {
      const timer = setTimeout(() => {
        setOpenNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openNotification]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Capturar el valor del captcha
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // Alternar la visibilidad de la contraseña
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMessage('Por favor, completa el captcha.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://backendodontologia.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, captchaValue }),
      });

      const data = await response.json();

      if (response.ok) {
        // Inicio de sesión exitoso
        if (data.user.tipo === 'administrador') {
          navigate('/Administrador/principal');
        } else if (data.user.tipo === 'paciente') {
          navigate('/Paciente/principal');
        }
      } else if (data.lockStatus) {
        // Cuenta bloqueada
        setNotificationMessage(`Cuenta bloqueada hasta ${data.lockUntil}`);
        setOpenNotification(true);
        setErrorMessage('');
      } else if (data.invalidEmail) {
        // Correo inválido
        setNotificationMessage('Advertencia: Correo no válido.');
        setOpenNotification(true);
        setErrorMessage('');
      } else if (data.failedAttempts !== undefined) {
        // Contraseña incorrecta, mostrar notificación
        setNotificationMessage(`Intentos fallidos: ${data.failedAttempts}`);
        setOpenNotification(true);
        setErrorMessage('Contraseña incorrecta.');
      } else {
        // Manejo genérico de errores
        setErrorMessage(data.message || 'Error al iniciar sesión.');
        setNotificationMessage('');
      }

      recaptchaRef.current.reset();
      setCaptchaValue(null);
    } catch (error) {
      setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #1A2A3A 30%, #1D2A38 100%)'
          : 'linear-gradient(135deg, #FFFFFF 30%, #E3F2FD 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
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

      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: '15px',
          boxShadow: 3,
          position: 'relative',
          backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
          color: isDarkMode ? '#FFFFFF' : '#000000',
          padding: '20px',
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <IconButton sx={{ fontSize: 40, color: isDarkMode ? '#FFFFFF' : '#00bcd4' }}>
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
                    <InputAdornment position="start">
                      <IconButton sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                        <Email />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: isDarkMode ? '#444444' : '#FFFFFF',
                  borderRadius: '5px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#B0BEC5' : '#616161',
                  },
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
                    <InputAdornment position="start">
                      <IconButton sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                        <Lock />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility} sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: isDarkMode ? '#444444' : '#FFFFFF',
                  borderRadius: '5px',
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#B0BEC5' : '#616161',
                  },
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
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#000000',
                '&:hover': { backgroundColor: '#00a3ba' },
                py: 1.5,
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
              disabled={!captchaValue || isLoading}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Iniciar Sesión'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#82B1FF' : '#00bcd4' }}>
                <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                  ¿No tienes cuenta? Registrarte
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: isDarkMode ? '#82B1FF' : '#00bcd4' }}>
                <Link to="/recuperacion" style={{ color: 'inherit', textDecoration: 'none' }}>
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
        type={
          notificationMessage.includes('Cuenta bloqueada')
            ? 'error'
            : notificationMessage.includes('Advertencia')
            ? 'warning'
            : 'info'
        }
        handleClose={() => setOpenNotification(false)}
      />
    </Box>
  );
};

export default Login;
