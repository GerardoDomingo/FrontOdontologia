import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, Container, Card, CardContent, MenuItem, Select, FormControl, InputLabel, FormHelperText, InputAdornment } from '@mui/material'; // Aquí ya no importamos Grid
import { FaUser, FaPhone, FaEnvelope, FaLock, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'; // Agrega FaInfoCircle aquí
import zxcvbn from 'zxcvbn';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
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
  const [isEmailSent, setIsEmailSent] = useState(false); // Para saber si se ha enviado el correo
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Para saber si el correo ya está verificado
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // Saber si se está verificando el correo
  const [isVerifiedComplete, setIsVerifiedComplete] = useState(false); // Saber si ya está verificado el código
  const [emailVerificationError, setEmailVerificationError] = useState(''); // Errores de verificación de correo
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [openNotification, setOpenNotification] = useState(false); const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const navigate = useNavigate();
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|live)\.com$/;
  const phoneRegex = /^\d{10}$/;

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

    // Remover espacios en blanco al principio y al final del valor
    const trimmedValue = value.trim();

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    //Validacion de la contraseña
    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
      checkPasswordSafety(value);

      const customErrors = checkPasswordRules(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: customErrors.length > 0 ? customErrors.join(' ') : '',
      }));
    }
    // Validación de nombre y apellidos
    if (name === 'nombre') {
      if (!nameRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nombre: 'El nombre solo debe contener letras',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nombre: '',
        }));
      }
    }

    if (name === 'aPaterno') {
      if (!nameRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          aPaterno: 'El apellido paterno solo debe contener letras',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          aPaterno: '',
        }));
      }
    }

    if (name === 'aMaterno') {
      if (!nameRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          aMaterno: 'El apellido materno solo debe contener letras',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          aMaterno: '',
        }));
      }
    }

    // Validación de edad (entre 1 y 100 años)
    if (name === 'edad') {
      if (value < 1 || value > 100) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          edad: 'Verifique que su edad sea la correcta',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          edad: '',
        }));
      }
    }
    if (name === 'email') {
      if (value !== trimmedValue || !emailRegex.test(trimmedValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Verifique que su correo sea valido',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '',
        }));
      }
    }

    if (name === 'telefono') {
      if (!phoneRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          telefono: 'Verifique que su numero de telefono sea valido',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          telefono: '',
        }));
      }
    }

    // Validación de alergias adicionales cuando se selecciona "Otro"
    if (name === 'alergias' && value === 'Otro') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otraAlergia: formData.otraAlergia ? '' : 'Especifica la alergia',
      }));
    }
    if (name === 'otraAlergia' && formData.alergias === 'Otro') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otraAlergia: value ? '' : 'Especifica la alergia',
      }));
    }
  };

  // Función para verificar si la contraseña ha sido filtrada en brechas de seguridad
  const checkPasswordSafety = async (password) => {
    setIsLoading(true); // Iniciar la carga
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
        setIsPasswordFiltered(true); // Actualizar el estado de filtrado
      } else {
        setPasswordError('');
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false); // Contraseña no filtrada
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsLoading(false); // Detener la carga
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

        if (response.status === 200 || response.status === 201) {
          setNotificationMessage('Usuario registrado exitosamente');
          setNotificationType('success');
          setOpenNotification(true);

          // Redirige al login después de un pequeño delay (opcional)
          setTimeout(() => {
            navigate('/login'); // Redirige al login
          }, 2000); // Delay de 2 segundos para mostrar la notificación
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

  const handleVerifyEmail = async () => {
    const trimmedEmail = formData.email.trim(); // Eliminar espacios en blanco

    if (!formData.email) {
      setEmailVerificationError('Por favor, ingresa un correo electrónico.');
      return;
    }

    if (!trimmedEmail) {
      setEmailVerificationError('Por favor, ingresa un correo electrónico.');
      return;
    }

    // Verificar si el correo tiene el formato y dominio correcto
    if (!emailRegex.test(formData.email)) {
      setEmailVerificationError('Verifique que su correo sea ingresado correctamente');
      return;
    }

    setIsVerifyingEmail(true); // Cambia el botón a "Verificando..."
    setEmailVerificationError(''); // Limpia cualquier error previo

    try {
      const response = await axios.post('http://localhost:3001/api/send-verification-email', {
        email: trimmedEmail,
      });

      if (response.status === 200) {
        setIsEmailSent(true); // Indica que el correo fue enviado
        setNotificationMessage('Correo de verificación enviado.');
        setNotificationType('success');
        setOpenNotification(true);
      }
    } catch (error) {
      // Verifica si el servidor responde con un mensaje indicando que el correo ya está registrado
      if (error.response && error.response.status === 400 && error.response.data.message) {
        if (error.response.data.message === 'El correo electrónico ya está registrado.') {
          setEmailVerificationError('El correo electrónico ya está registrado. Por favor, intenta con otro correo.');
          setNotificationMessage('El correo electrónico ya está registrado.'); // Agregamos el mensaje a la notificación
          setNotificationType('error'); // Establece el tipo de notificación
          setOpenNotification(true); // Abre la notificación
        } else {
          setEmailVerificationError(error.response.data.message); // Captura otros mensajes de error del servidor
        }
      } else {
        setEmailVerificationError('Error al enviar el correo de verificación.');
      }
    } finally {
      setIsVerifyingEmail(false); // Finaliza la verificación
    }
  };

  // Verificar el token de verificación
  const handleVerifyToken = async () => {
    if (!formData.verificationToken) {
      setEmailVerificationError('Por favor, ingresa el token de verificación.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/verify-token', {
        email: formData.email,
        token: formData.verificationToken,
      });

      if (response.status === 200) {
        setIsEmailVerified(true); // Verificación completada
        setIsVerifiedComplete(true); // Marca como verificado
        setEmailVerificationError('');
        setNotificationMessage('Correo verificado correctamente.');
        setNotificationType('success');
        setOpenNotification(true);
      }
    } catch (error) {
      // Mostrar el mensaje específico que el servidor envía
      if (error.response && error.response.status === 400) {
        setEmailVerificationError(error.response.data.message); // Mostrar mensaje específico de token inválido o expirado
      } else {
        setEmailVerificationError('Error en el servidor al verificar el token.');
      }
    }
  };


  const validateStep = () => {
    const stepErrors = {};
    if (activeStep === 0) {
      const nameRegex = /^[A-Za-z\s]+$/;

      // Validación de nombre y apellidos (solo letras)
      if (!formData.nombre || !nameRegex.test(formData.nombre)) {
        stepErrors.nombre = 'El nombre solo debe contener letras';
      }
      if (!formData.aPaterno || !nameRegex.test(formData.aPaterno)) {
        stepErrors.aPaterno = 'El apellido paterno solo debe contener letras';
      }
      if (!formData.aMaterno || !nameRegex.test(formData.aMaterno)) {
        stepErrors.aMaterno = 'El apellido materno solo debe contener letras';
      }

      // Validación de la edad (entre 1 y 100 años)
      if (!formData.edad || formData.edad < 1 || formData.edad > 100) {
        stepErrors.edad = 'Verifique que su edad sea la correcta';
      }

      // Validación de género y lugar de procedencia (ya existente)
      if (!formData.genero) {
        stepErrors.genero = 'Selecciona un género';
      }
      if (formData.lugar === 'Otro' && !formData.otroLugar) {
        stepErrors.otroLugar = 'Especifica el lugar';
      }
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
            {/* Campo de correo electrónico */}
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              disabled={isEmailVerified || isVerifiedComplete} // Deshabilitar si ya está verificado
            />

            {!isEmailVerified && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyEmail} // Función para verificar el correo
                sx={{ mt: 2 }}
                disabled={isVerifyingEmail || isVerifiedComplete || isEmailSent} // Deshabilitar si ya se verificó o se está verificando
              >
                {isVerifiedComplete ? 'Verificado' : isVerifyingEmail ? 'Verificando...' : isEmailSent ? 'Correo Enviado' : 'Verificar Correo'}
              </Button>

            )}

            {/* Mostrar mensaje de verificación exitosa o error */}
            {isEmailVerified && (
              <Typography sx={{ color: 'green', mt: 2 }}>
                Correo verificado correctamente.
              </Typography>
            )}

            {emailVerificationError && (
              <Typography sx={{ color: 'red', mt: 2 }}>
                {emailVerificationError}
              </Typography>
            )}

            {/* Si el correo está verificado, permitir la entrada del código de verificación */}
            {isEmailSent && !isEmailVerified && (
              <TextField
                fullWidth
                label="Código de verificación"
                name="verificationToken"
                value={formData.verificationToken}
                onChange={(e) => setFormData({ ...formData, verificationToken: e.target.value })}
                margin="normal"
                required
                error={!!errors.verificationToken}
                helperText={errors.verificationToken}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {/* Botón para validar el código de verificación */}
            {isEmailSent && !isEmailVerified && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyToken} // Función para validar el token
                sx={{ mt: 2 }}
              >
                Validar Código
              </Button>
            )}

            {/* Mostrar el resto de los campos sólo si el correo ha sido verificado */}
            {isEmailVerified && (
              <>
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
              </>
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

            {/* Indicadores de seguridad de la contraseña */}
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            {isPasswordFiltered && <p style={{ color: 'red' }}>Contraseña filtrada. Por favor, elige otra.</p>}
            {isPasswordSafe && !isPasswordFiltered && (
              <p>
                <FaCheckCircle style={{ color: 'green' }} /> Contraseña segura
              </p>
            )}
            {/* Barra de fortaleza de la contraseña */}

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
    <Container maxWidth="md" sx={{ mt: 6, mb: 14 }}> {/* Aquí agregamos marginTop y marginBottom */}
      {/* Aquí va la notificación */}
      <Notificaciones
        open={openNotification}
        message={notificationMessage}
        type={notificationType}
        handleClose={handleCloseNotification}
      />
      <Card sx={{ p: 4, boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', borderRadius: '16px', marginBottom: '20px' }}>
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
                <StepLabel
                  StepIconProps={{
                    sx: { display: 'flex' }, // Asegura que los íconos se sigan mostrando
                  }}
                  sx={{
                    // Oculta solo el texto en pantallas pequeñas (xs), pero deja los íconos
                    '& .MuiStepLabel-label': {
                      display: { xs: 'none', sm: 'block' } // Oculta solo el texto en xs
                    }
                  }}
                >
                  {label}
                </StepLabel>
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
