import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton, InputAdornment, CircularProgress, Modal, Backdrop, Fade } from '@mui/material';
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
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
  const [verificationCode, setVerificationCode] = useState(''); // Estado para el código de verificación
  const [isVerifying, setIsVerifying] = useState(false); // Indicador de carga para la verificación


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

  // Eliminar notificación después de un tiempo específico
  useEffect(() => {
    if (openNotification) {
      let duration = 3000; // Duración predeterminada: 3 segundos
      if (notificationMessage.includes('Cuenta bloqueada')) {
        duration = 6000; // 6 segundos para mensajes de cuenta bloqueada
      }

      const timer = setTimeout(() => {
        setOpenNotification(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [openNotification, notificationMessage]);

  // Eliminar mensaje de error después de 3 segundos
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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

  // Función para formatear la fecha de manera amigable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMessage('Por favor, completa el captcha.');
      recaptchaRef.current.reset(); // Asegura que el captcha siempre esté listo para el próximo intento
      return;
    }


    setIsLoading(true);

    try {
      const response = await fetch('https://backendodontologia.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para enviar cookies
        body: JSON.stringify({ ...formData, captchaValue }),
      });

      const data = await response.json();

      if (response.ok) {
        // Credenciales correctas, enviar código de verificación
        const sendCodeResponse = await fetch('https://backendodontologia.onrender.com/api/send-verification-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        if (sendCodeResponse.ok) {
          setNotificationMessage('Se ha enviado un código de verificación a su correo electrónico.');
          setOpenNotification(true);
          setOpenModal(true); // Abrir el modal para ingresar el código
        } else {
          setErrorMessage('Error al enviar el código de verificación. Intenta de nuevo.');
        }
      } else if (data.lockStatus) {
        // Cuenta bloqueada
        const formattedDate = formatDate(data.lockUntil);
        setNotificationMessage(`Cuenta bloqueada hasta ${formattedDate}`);
        setOpenNotification(true);
        setErrorMessage('');
      } else if (data.invalidEmail) {
        // Correo inválido
        setNotificationMessage('Advertencia: Correo no válido.');
        setOpenNotification(true);
        setErrorMessage('');
      } else if (data.failedAttempts !== undefined) {
        // Contraseña incorrecta
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

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrorMessage('Por favor, ingresa el código de verificación.');
      return;
    }
    setIsVerifying(true);
    try {
      const response = await fetch('https://backendodontologia.onrender.com/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificationMessage('Código verificado correctamente.');
        setOpenNotification(true);
        setOpenModal(false);
        if (data.user.tipo === 'administrador') {
          navigate('/Administrador/principal');
        } else if (data.user.tipo === 'paciente') {
          navigate('/Paciente/principal');
        }
      } else {
        setErrorMessage(data.message || 'Código de verificación incorrecto.');
      }
    } catch (error) {
      setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsVerifying(false);
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
      {/* Modal para Verificación Multifactor */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verificación Multifactor
            </Typography>
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
            <TextField
              fullWidth
              label="Código de Verificación"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerifyCode}
              disabled={isVerifying}
            >
              {isVerifying ? <CircularProgress size={24} /> : 'Verificar Código'}
            </Button>

          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Login;
