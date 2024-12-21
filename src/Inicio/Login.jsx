import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { FaTooth } from 'react-icons/fa';
import { Email, Lock, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate, Link } from 'react-router-dom';
import Notificaciones from '../Compartidos/Notificaciones';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState('');
  const [isCaptchaLocked, setIsCaptchaLocked] = useState(false);

  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  // Función helper para manejar el timeout en fetch
  const fetchWithTimeout = async (url, options, timeout = 15000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado tiempo en responder');
      }
      throw error;
    }
  };

  const handleCaptchaError = () => {
    setErrorMessage('Error al cargar el captcha. Por favor, recarga la página.');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  // Detectar el tema del sistema
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);
    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
  }, []);

  // Eliminar notificación después de un tiempo específico
  useEffect(() => {
    if (openNotification) {
      let duration = 3000;
      if (notificationMessage.includes('Cuenta bloqueada')) {
        duration = 6000;
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

  useEffect(() => {
    const checkRecaptcha = setTimeout(() => {
      if (!window.grecaptcha) {
        setErrorMessage('Error al cargar el captcha. Verifica tu conexión a internet.');
      }
    }, 3000);

    return () => clearTimeout(checkRecaptcha);
  }, []);

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
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchWithTimeout(
        'https://backendodontologia.onrender.com/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ ...formData, captchaValue }),
        },
        15000 // 15 segundos de timeout
      );

      const data = await response.json();

      if (response.ok) {
        try {
          const sendCodeResponse = await fetchWithTimeout(
            'https://backendodontologia.onrender.com/api/send-verification-code',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: formData.email }),
            },
            15000
          );

          if (sendCodeResponse.ok) {
            setNotificationMessage('Se ha enviado un código de verificación a su correo electrónico.');
            setOpenNotification(true);
            setOpenModal(true);
            setIsCaptchaLocked(true);
          } else {
            const errorData = await sendCodeResponse.json();
            setErrorMessage(errorData.message || 'Error al enviar el código de verificación. Intenta de nuevo.');
          }
        } catch (error) {
          setErrorMessage('Error al enviar el código de verificación. Por favor, intenta nuevamente.');
        }
      } else if (data.failedAttempts !== undefined) {
        setNotificationMessage(`Intentos fallidos: ${data.failedAttempts}`);
        setOpenNotification(true);
        setErrorMessage('Contraseña incorrecta.');
      } else if (data.lockStatus) {
        const formattedDate = new Date(data.lockUntil).toLocaleString('es-ES');
        setNotificationMessage(`Cuenta bloqueada hasta ${formattedDate}`);
        setOpenNotification(true);
      } else {
        setErrorMessage(data.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      if (error.message === 'La solicitud tardó demasiado tiempo en responder') {
        setErrorMessage('El servidor está tardando en responder. Por favor, intenta nuevamente.');
      } else {
        setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
      }
    } finally {
      setIsLoading(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaValue(null);
    }
  };

  // Manejar la verificación del código
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setErrorMessage('Por favor, ingresa el código de verificación.');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch('https://backendodontologia.onrender.com/api/verify-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email.trim(), code: verificationCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Error al verificar el código.');
        return;
      }

      setNotificationMessage(data.message || 'Código verificado correctamente.');
      setOpenNotification(true);
      setVerificationCode('');
      setOpenModal(false);

      if (data.userType === 'administradores') {
        localStorage.setItem('loggedIn', true);
        navigate('/Administrador/principal');
      } else if (data.userType === 'pacientes') {
        localStorage.setItem('loggedIn', true);
        navigate('/Paciente/principal');
      } else {
        setErrorMessage('Tipo de usuario desconocido. Inténtalo nuevamente.');
      }
    } catch (error) {
      setErrorMessage('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)'
          : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: '16px', sm: '20px' },
        position: 'relative',
      }}
    >
      <IconButton
        component={Link}
        to="/"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: isDarkMode ? '#60a5fa' : '#3b82f6',
          '&:hover': {
            transform: 'scale(1.1)',
            transition: 'transform 0.2s',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBack />
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              color: isDarkMode ? '#cbd5e1' : '#475569',
              opacity: 0.9
            }}
          >
            Atrás
          </Typography>
        </Box>
      </IconButton>

      <Card
        component={motion.div}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
        sx={{
          maxWidth: { xs: '100%', sm: 400 },
          width: '100%',
          borderRadius: '20px',
          boxShadow: isDarkMode
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(148, 163, 184, 0.2)',
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
          padding: '24px',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <IconButton
              sx={{
                fontSize: 48,
                color: isDarkMode ? '#60a5fa' : '#3b82f6',
                mb: 2
              }}
            >
              <FaTooth />
            </IconButton>
          </motion.div>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 4,
              background: isDarkMode
                ? 'linear-gradient(to right, #60a5fa, #3b82f6)'
                : 'linear-gradient(to right, #3b82f6, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Iniciar Sesión
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                component={motion.div}
                variants={inputVariants}
                whileFocus="focus"
                whileBlur="blur"
                fullWidth
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: isDarkMode ? '#60a5fa' : '#3b82f6' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(241, 245, 249, 0.8)',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(241, 245, 249, 1)',
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#475569' : '#cbd5e1',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#cbd5e1' : '#64748b',
                    '&.Mui-focused': {
                      color: isDarkMode ? '#60a5fa' : '#3b82f6',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                component={motion.div}
                variants={inputVariants}
                whileFocus="focus"
                whileBlur="blur"
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
                      <Lock sx={{ color: isDarkMode ? '#60a5fa' : '#3b82f6' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        sx={{ color: isDarkMode ? '#60a5fa' : '#3b82f6' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(241, 245, 249, 0.8)',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(241, 245, 249, 1)',
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#475569' : '#cbd5e1',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#cbd5e1' : '#64748b',
                    '&.Mui-focused': {
                      color: isDarkMode ? '#60a5fa' : '#3b82f6',
                    },
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                position: 'relative'
              }}
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Lc74mAqAAAAAL5MmFjf4x0PWP9MtBNEy9ypux_h"
                onChange={isCaptchaLocked ? null : handleCaptchaChange}
                onError={handleCaptchaError}
                onLoad={() => setIsCaptchaLoading(false)}
                theme={isDarkMode ? 'dark' : 'light'}
              />
              {isCaptchaLocked && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    cursor: 'not-allowed',
                    zIndex: 1,
                  }}
                />
              )}
              {isCaptchaLoading && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Cargando captcha...
                </Typography>
              )}
            </Box>


            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? '#ef4444' : '#dc2626',
                    textAlign: 'center',
                    mb: 3,
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    p: 2,
                    borderRadius: '12px',
                  }}
                >
                  {errorMessage}
                </Typography>
              </motion.div>
            )}

            <Button
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(to right, #60a5fa, #3b82f6)'
                  : 'linear-gradient(to right, #3b82f6, #2563eb)',
                color: '#ffffff',
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(96, 165, 250, 0.3)'
                  : '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: isDarkMode
                    ? 'linear-gradient(to right, #3b82f6, #2563eb)'
                    : 'linear-gradient(to right, #2563eb, #1d4ed8)',
                },
                '&.Mui-disabled': {
                  background: isDarkMode
                    ? 'linear-gradient(to right, #475569, #64748b)'
                    : 'linear-gradient(to right, #94a3b8, #cbd5e1)',
                  color: isDarkMode ? '#94a3b8' : '#f1f5f9',
                },
              }}
              disabled={!captchaValue || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: '#ffffff' }} />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            {openModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? '#60a5fa' : '#3b82f6',
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    Se envió un código de verificación a tu correo. Ingresa el código aquí:
                  </Typography>
                  <TextField
                    fullWidth
                    label="Código de Verificación"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(241, 245, 249, 0.8)',
                        borderRadius: '12px',
                        '& .MuiInputBase-input': {
                          color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        },
                        '& fieldset': {
                          borderColor: isDarkMode ? '#475569' : '#cbd5e1',
                        },
                        '&:hover fieldset': {
                          borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: isDarkMode ? '#cbd5e1' : '#64748b',
                        '&.Mui-focused': {
                          color: isDarkMode ? '#60a5fa' : '#3b82f6',
                        },
                      },
                    }}
                  />
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variant="contained"
                    fullWidth
                    onClick={handleVerifyCode}
                    disabled={isVerifying}
                    sx={{
                      background: isDarkMode
                        ? 'linear-gradient(to right, #60a5fa, #3b82f6)'
                        : 'linear-gradient(to right, #3b82f6, #2563eb)',
                      color: '#ffffff',
                      py: 1.5,
                      fontSize: '16px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      textTransform: 'none',
                      boxShadow: isDarkMode
                        ? '0 4px 12px rgba(96, 165, 250, 0.3)'
                        : '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    {isVerifying ? (
                      <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                    ) : (
                      'Verificar Código'
                    )}
                  </Button>
                </Box>
              </motion.div>
            )}

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? '#60a5fa' : '#3b82f6',
                    mb: 1,
                  }}
                >
                  <Link
                    to="/register"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    ¿No tienes cuenta? Regístrate
                  </Link>
                </Typography>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? '#60a5fa' : '#3b82f6',
                  }}
                >
                  <Link
                    to="/recuperacion"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Typography>
              </motion.div>
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
