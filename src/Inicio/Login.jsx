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
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar el loader
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

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

  // Manejar el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Capturar el valor del captcha cuando se completa
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // Alternar la visibilidad de la contraseña
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Cerrar la notificación
  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que el captcha esté completado
    if (!captchaValue) {
      setErrorMessage('Por favor, completa el captcha.');
      return;
    }
  
    setIsLoading(true); // Mostrar el loader mientras se procesa la solicitud
  
    try {
      // Realizar la solicitud de inicio de sesión al backend
      const response = await fetch('https://backendodontologia.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para incluir cookies en la solicitud
        body: JSON.stringify({ ...formData, captchaValue }), // Datos del formulario y captcha
      });
  
      // Parsear la respuesta del servidor
      const data = await response.json();
  
      // Si el inicio de sesión es exitoso
      if (response.ok) {
        // Verificar el tipo de usuario y redirigir a la página correspondiente
        if (data.user.tipo === 'administrador') {
          navigate('/Administrador/principal');
        } else if (data.user.tipo === 'paciente') {
          navigate('/Paciente/principal');
        }
      } else {
        // Si el inicio de sesión falla, mostrar el mensaje de error
        setNotificationMessage(`Intentos fallidos: ${data.failedAttempts || 0}`);
        setOpenNotification(true);
        recaptchaRef.current.reset(); // Resetear el captcha en caso de error
        setCaptchaValue(null); // Desactivar el captcha hasta que el usuario lo complete de nuevo
        setErrorMessage(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false); // Desactivar el loader después de que termine la solicitud
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
              disabled={!captchaValue || isLoading}  // Deshabilitar el botón si no se ha resuelto el captcha o si está cargando
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Iniciar Sesión'}  {/* Mostrar el loader o texto */}
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
