import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, Container, Card, CardContent, MenuItem, Select, FormControl, InputLabel, FormHelperText, Grid, InputAdornment } from '@mui/material';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaHome, FaInfoCircle } from 'react-icons/fa';
import zxcvbn from 'zxcvbn';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones'

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    edad: '',
    genero: '',
    lugar: '',
    otroLugar: '',
    telefono: '',
    email: '',
    alergias: '',
    otraAlergia: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [openNotification, setOpenNotification] = useState(false); // Estado para manejar la notificación
  const [notificationMessage, setNotificationMessage] = useState(''); // Mensaje de la notificación
  const [notificationType, setNotificationType] = useState('success'); // Tipo de notificación (success, error, etc.)

  const handleCloseNotification = () => {
    setOpenNotification(false); // Función para cerrar la notificación
  };

  const steps = ['Datos personales', 'Información de contacto', 'Datos de acceso'];

  // Función para verificar si la contraseña cumple con las reglas personalizadas
  const checkPasswordRules = (password) => {
    const errors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password); // No repetir más de 3 letras seguidas

    if (!hasUpperCase) errors.push('Debe tener al menos una letra mayúscula.');
    if (!hasNumber) errors.push('Debe tener al menos un número.');
    if (!hasSpecialChar) errors.push('Debe tener al menos un símbolo especial.');
    if (!hasMinLength) errors.push('Debe tener más de 8 caracteres.');
    if (!noRepeatingChars) errors.push('No puede tener más de 3 letras seguidas iguales.');

    return errors;
  };

  // Función para manejar el cambio en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);

      const customErrors = checkPasswordRules(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: customErrors.length > 0 ? customErrors.join(' ') : '',
      }));
    }
  };


  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        // Imprime los datos que se van a enviar
        console.log('Datos que se enviarán:', formData);

        const response = await axios.post('http://localhost:3001/api/register', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setNotificationMessage('Usuario registrado exitosamente');
          setNotificationType('success');
          setOpenNotification(true);
        } else {
          setNotificationMessage('Error al registrar el usuario');
          setNotificationType('error');
          setOpenNotification(true);
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          // Aquí es donde capturas el mensaje del servidor (como 'El correo electrónico ya está registrado')
          setNotificationMessage(error.response.data.message);  // Muestra el mensaje exacto del servidor
          setNotificationType('error');
        } else {
          setNotificationMessage('Error en la solicitud');
          setNotificationType('error');
        }
        setOpenNotification(true);
      }
    }
  };

  const validateStep = () => {
    const stepErrors = {};
    if (activeStep === 0) {
      if (!formData.nombre) stepErrors.nombre = 'El nombre es requerido';
      if (!formData.aPaterno) stepErrors.aPaterno = 'El apellido paterno es requerido';
      if (!formData.aMaterno) stepErrors.aMaterno = 'El apellido materno es requerido';
      if (!formData.edad || formData.edad <= 0) stepErrors.edad = 'Ingresa una edad válida';
      if (!formData.genero) stepErrors.genero = 'Selecciona un género';
      if (formData.lugar === 'Otro' && !formData.otroLugar) stepErrors.otroLugar = 'Especifica el lugar';
    }

    if (activeStep === 1) {
      if (!formData.telefono) stepErrors.telefono = 'El teléfono es requerido';
      if (!formData.email) stepErrors.email = 'El correo electrónico es requerido';
      if (formData.alergias === 'Otro' && !formData.otraAlergia) stepErrors.otraAlergia = 'Especifica la alergia';
    }

    if (activeStep === 2) {
      if (!formData.password) stepErrors.password = 'La contraseña es requerida';
      if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const alergiasInfo = {
    Penicilina: 'Antibiótico común.',
    Látex: 'Material en guantes y equipo dental.',
    'Anestésicos Locales': 'Utilizado en procedimientos odontológicos.',
    Metales: 'Usado en coronas y aparatos.',
    Acrílico: 'Presente en prótesis dentales.',
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.nombre}
              helperText={errors.nombre}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Apellido Paterno"
              name="aPaterno"
              value={formData.aPaterno}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.aPaterno}
              helperText={errors.aPaterno}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Apellido Materno"
              name="aMaterno"
              value={formData.aMaterno}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.aMaterno}
              helperText={errors.aMaterno}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.edad}
              helperText={errors.edad}
            />
            <FormControl fullWidth margin="normal" required error={!!errors.genero}>
              <InputLabel>Género</InputLabel>
              <Select
                value={formData.genero}
                onChange={handleChange}
                label="Género"
                name="genero"
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
              {errors.genero && <FormHelperText>{errors.genero}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" required error={!!errors.lugar}>
              <InputLabel>Lugar de Proveniencia</InputLabel>
              <Select
                value={formData.lugar}
                onChange={handleChange}
                label="Lugar de Proveniencia"
                name="lugar"
              >
                <MenuItem value="Ixcatlan">Ixcatlan</MenuItem>
                <MenuItem value="Tepemaxac">Tepemaxac</MenuItem>
                <MenuItem value="Pastora">Pastora</MenuItem>
                <MenuItem value="Ahuacatitla">Ahuacatitla</MenuItem>
                <MenuItem value="Tepeica">Tepeica</MenuItem>
                <MenuItem value="Axcaco">Axcaco</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
              {errors.lugar && <FormHelperText>{errors.lugar}</FormHelperText>}
            </FormControl>

            {formData.lugar === 'Otro' && (
              <TextField
                fullWidth
                label="Especificar Lugar"
                name="otroLugar"
                value={formData.otroLugar}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.otroLugar}
                helperText={errors.otroLugar}
              />
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.telefono}
              helperText={errors.telefono}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaPhone />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaEnvelope />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth margin="normal" error={!!errors.alergias}>
              <InputLabel>Alergias </InputLabel>
              <Select
                value={formData.alergias}
                onChange={handleChange}
                label="Alergias"
                name="alergias"
              >
                <MenuItem value="Ninguna">Ninguna</MenuItem>
                {Object.keys(alergiasInfo).map((alergia) => (
                  <MenuItem key={alergia} value={alergia}>
                    {alergia}
                  </MenuItem>
                ))}
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
              {errors.alergias && <FormHelperText>{errors.alergias}</FormHelperText>}
            </FormControl>

            {formData.alergias && alergiasInfo[formData.alergias] && (
              <Typography variant="caption" sx={{ color: 'gray', display: 'flex', alignItems: 'center', mt: 1 }}>
                <FaInfoCircle style={{ marginRight: '5px' }} /> {alergiasInfo[formData.alergias]}
              </Typography>
            )}

            {formData.alergias === 'Otro' && (
              <TextField
                fullWidth
                label="Especificar Alergia"
                name="otraAlergia"
                value={formData.otraAlergia}
                onChange={handleChange}
                margin="normal"
                error={!!errors.otraAlergia}
                helperText={errors.otraAlergia}
              />
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Fortaleza de la contraseña</Typography>
              <Box
                sx={{
                  height: '10px',
                  width: '100%',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  mt: 1,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor:
                      passwordStrength < 2
                        ? 'red'
                        : passwordStrength === 2
                          ? 'yellow'
                          : 'green',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out', // Agregamos transición también al color
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color:
                    passwordStrength < 2 ? 'red' : passwordStrength === 2 ? 'yellow' : 'green',
                  mt: 1,
                }}
              >
                {passwordStrength === 0 && 'Muy débil'}
                {passwordStrength === 1 && 'Débil'}
                {passwordStrength === 2 && 'Regular'}
                {passwordStrength === 3 && 'Fuerte'}
                {passwordStrength === 4 && 'Muy fuerte'}
              </Typography>
            </Box>

          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Aquí va la notificación */}
      <Notificaciones
        open={openNotification}
        message={notificationMessage}
        type={notificationType}
        handleClose={handleCloseNotification}
      />
      <Card sx={{ p: 4, boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', borderRadius: '16px' }}>
        <CardContent>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', mb: 4, color: '#1976d2', fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}
          >
            Registro de Paciente
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 2 }}>
                  Regresar
                </Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" type="submit" sx={{ px: 4 }}>
                  Registrar
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext} sx={{ px: 4 }}>
                  Siguiente
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
