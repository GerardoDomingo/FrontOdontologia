import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton } from '@mui/material';
import { FaTooth } from 'react-icons/fa';
import { Email, Lock } from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate de importar estos desde react-router-dom

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const navigate = useNavigate(); // Aquí definimos navigate usando el hook useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorMessage('Por favor, completa el captcha.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, captchaValue }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/Paciente/principal');
      } else {
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
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: '15px', boxShadow: 3 }}>
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
                type="password"
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
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              {/* Mostrar el captcha solo cuando el usuario haga clic */}

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
              disabled={!captchaValue}
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
                <Link to="/forgot-password" style={{ color: '#00bcd4', textDecoration: 'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
