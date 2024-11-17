import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, Container, Card, CardContent, MenuItem, Select, FormControl, InputLabel, FormHelperText, InputAdornment, CircularProgress, Checkbox, FormControlLabel, Link, Modal } from '@mui/material';
import { FaUser, FaPhone, FaEnvelope, FaLock, FaCheckCircle, FaInfoCircle, FaEyeSlash, FaEye, FaPlusCircle } from 'react-icons/fa'; // Importamos 
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
    alergias: [],
    otraAlergia: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifiedComplete, setIsVerifiedComplete] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [openNotification, setOpenNotification] = useState(false); const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const steps = ['Datos personales', 'Información de contacto', 'Datos de acceso'];
  const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\u00e0-\u00fc\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|live|uthh\.edu)\.(com|mx)$/;
  const phoneRegex = /^\d{10}$/;
  const today = new Date().toISOString().split('T')[0];


  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [allAccepted, setAllAccepted] = useState(false);
  const handleAcceptChange = (event) => {
    setAllAccepted(event.target.checked);
  };


  // Función para abrir el modal de políticas de privacidad y obtener su contenido si aún no está cargado
  const handleOpenPrivacyModal = async (event) => {
    event.stopPropagation();
    if (!privacyPolicy) await fetchPrivacyPolicy(); // Solo llamar si no está cargado
    setOpenPrivacyModal(true);
  };

  // Función para abrir el modal de términos y condiciones y obtener su contenido si aún no está cargado
  const handleOpenTermsModal = async (event) => {
    event.stopPropagation();
    if (!termsConditions) await fetchTermsConditions(); // Solo llamar si no está cargado
    setOpenTermsModal(true);
  };

  const handleClosePrivacyModal = () => setOpenPrivacyModal(false);
  const handleCloseTermsModal = () => setOpenTermsModal(false);


  const fetchPrivacyPolicy = async () => {
    try {
      const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/politicas_privacidad');
      const activePolicy = response.data.find(policy => policy.estado === 'activo');
      setPrivacyPolicy(activePolicy ? activePolicy.contenido : 'No se encontraron políticas de privacidad activas.');
    } catch (error) {
      console.error('Error al obtener las políticas de privacidad', error);
      setPrivacyPolicy('Error al cargar las políticas de privacidad.');
    }
  };

  const fetchTermsConditions = async () => {
    try {
      const response = await axios.get('https://backendodontologia.onrender.com/api/termiCondicion/terminos_condiciones');
      const activeTerms = response.data.find(term => term.estado === 'activo');
      setTermsConditions(activeTerms ? activeTerms.contenido : 'No se encontraron términos y condiciones activos.');
    } catch (error) {
      console.error('Error al obtener los términos y condiciones', error);
      setTermsConditions('Error al cargar los términos y condiciones.');
    }
  };


  const handleCloseNotification = () => {
    setOpenNotification(false); // Función para cerrar la notificacióooon
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para alternar la visibilidad de la confirmación de contraseña
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Función para verificar las reglas personalizadas
  const checkPasswordRules = (password) => {
    const errors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password);  // No repetir más de 3 letras seguidas

    if (!hasUpperCase) errors.push('Debe tener al menos una letra mayúscula.');
    if (!hasNumber) errors.push('Debe tener al menos un número.');
    if (!hasSpecialChar) errors.push('Debe tener al menos un símbolo especial.');
    if (!hasMinLength) errors.push('Debe tener más de 8 caracteres.');
    if (!noRepeatingChars) errors.push('No puede tener más de 3 letras seguidas iguales.');

    return errors;
  };

  // Función para verificar tanto la seguridad como las reglas de la contraseña
  const checkPasswordValidity = async (password) => {
    const customErrors = checkPasswordRules(password);

    if (customErrors.length > 0) {
      // Si no cumple con las reglas personalizadas, mostramos los errores
      setPasswordError(customErrors.join(' '));
      setIsPasswordSafe(false);  // Marcar como insegura
      return false;
    }

    // Si cumple con las reglas personalizadas, verificamos si la contraseña ha sido filtrada
    setIsLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
        setIsPasswordFiltered(true);
        return false;  // No permitir el registro
      } else {
        // Si la contraseña no ha sido filtrada
        setPasswordError('');
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false);
        return true;  // Permitir el registro
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
      return false;
    } finally {
      setIsLoading(false);
    }
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

    // Validación de la contraseña
    if (name === 'password') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
      checkPasswordValidity(value).then((isValid) => {
        if (!isValid) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: 'La contraseña no cumple con los requisitos o ha sido filtrada.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: '',
          }));
        }
      });
    }

    // Validación de nombre y apellidos
    if (name === 'nombre') {
      if (!nameRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          nombre: 'El nombre solo debe contener letras.',
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

    if (name === 'fechaNacimiento') {
      const edad = calcularEdad(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        esMayorDeEdad: edad >= 18, // Booleano para saber si es mayor o menor de edad
      }));

      if (edad < 18) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          tutor: 'Por favor, selecciona un tutor legal.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          tutor: '',
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

    if (name === 'alergias' && value.includes('Otro')) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otraAlergia: formData.otraAlergia ? '' : 'Especifica la alergia',
      }));
    }

    if (name === 'otraAlergia') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        otraAlergia: value.trim() ? '' : 'Especifica la alergia',
      }));
    }

  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };


  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Iniciar el estado de cargando
    setIsLoading(true);

    // Forzar una espera de 2 segundos para mostrar el spinner de carga
    await delay(2000);

    let newErrors = {};

    // Validación para "Otro" en alergias
    if (formData.alergias.includes('Otro') && !formData.otraAlergia.trim()) {
      newErrors.otraAlergia = 'Especifica la alergia';
    }

    // Validación de lugar "Otro"
    if (formData.lugar === 'Otro' && !formData.otroLugar.trim()) {
      newErrors.otroLugar = 'Especifica el lugar';
    }

    // Validación de tutor si es menor de edad
    if (!formData.esMayorDeEdad) {
      if (!formData.tipoTutor) {
        newErrors.tipoTutor = 'Selecciona un tutor';
      }
      if (!formData.nombreTutor || formData.nombreTutor.trim() === '') {
        newErrors.nombreTutor = 'El nombre del tutor es obligatorio';
      }
    }

    // Establecer errores si los hay
    setErrors(newErrors);

    // Si hay errores, detener la carga y no continuar con el registro
    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    // Verificar la validez de la contraseña antes de permitir el registro
    const isPasswordValid = await checkPasswordValidity(formData.password);

    // Validar la fortaleza de la contraseña
    if (!isPasswordValid || passwordStrength < 3) {
      setNotificationMessage(
        passwordStrength < 3
          ? 'La contraseña debe ser al menos "Fuerte" para continuar con el registro.'
          : 'La contraseña debe cumplir con los requisitos y no haber sido filtrada.'
      );
      setNotificationType('error');
      setOpenNotification(true);
      setIsLoading(false);
      return;
    }

    // Reemplazar "Otro" en alergias y lugar si es necesario
    const alergiasFinal = formData.alergias.map((alergia) =>
      alergia === 'Otro' ? formData.otraAlergia : alergia
    );
    const lugarFinal = formData.lugar === 'Otro' ? formData.otroLugar : formData.lugar;

    // Preparar datos finales para el envío
    const dataToSubmit = {
      ...formData,
      lugar: lugarFinal,
      alergias: alergiasFinal,
      tutor: !formData.esMayorDeEdad
        ? { tipo: formData.tipoTutor, nombre: formData.nombreTutor }
        : null, // Solo incluir tutor si es menor de edad
    };

    try {
      const response = await axios.post('https://backendodontologia.onrender.com/api/register', dataToSubmit, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setNotificationMessage('Usuario registrado exitosamente');
        setNotificationType('success');
        setOpenNotification(true);

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setNotificationMessage('Error al registrar el usuario');
        setNotificationType('error');
        setOpenNotification(true);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setNotificationMessage(error.response.data.message);
      } else {
        setNotificationMessage('Error en la solicitud');
      }
      setNotificationType('error');
      setOpenNotification(true);
    } finally {
      setIsLoading(false); // Finalizar el estado de cargando
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
      const response = await axios.post('https://backendodontologia.onrender.com/api/send-verification-email', {
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
      const response = await axios.post('https://backendodontologia.onrender.com/api/verify-token', {
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
      if (formData.alergias.includes('Otro') && !formData.otraAlergia.trim()) {
        stepErrors.otraAlergia = 'Especifica la alergia';
      }
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
            {/* Campo de Nombre */}
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.nombre}
              helperText={errors.nombre || 'Solo letras, espacios y acentos.'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
            />
            {/* Campo de Apellido Paterno */}
            <TextField
              fullWidth
              label="Apellido Paterno"
              name="aPaterno"
              value={formData.aPaterno}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.aPaterno}
              helperText={errors.aPaterno || 'Solo letras, espacios y acentos.'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
            />
            {/* Campo de Apellido Materno */}
            <TextField
              fullWidth
              label="Apellido Materno"
              name="aMaterno"
              value={formData.aMaterno}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.aMaterno}
              helperText={errors.aMaterno || 'Solo letras, espacios y acentos.'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
            />
            {/* Campo de Fecha de Nacimiento */}
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              name="fechaNacimiento"
              type="date"
              inputProps={{ max: today }}
              value={formData.fechaNacimiento}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.fechaNacimiento}
              helperText={
                errors.fechaNacimiento || 'Selecciona tu fecha de nacimiento'
              }
              InputLabelProps={{ shrink: true }}
            />
            {/* Mostrar mensaje si es menor de edad después de seleccionar la fecha */}
            {formData.fechaNacimiento && !formData.esMayorDeEdad && (
              <Typography variant="caption" sx={{ color: 'red', mt: 1 }}>
                Parece que es menor de edad, por lo que se necesitan los datos del tutor.
              </Typography>
            )}


            {/* Mostrar campos de tutor si es menor de edad */}
            {!formData.esMayorDeEdad && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth margin="normal" required error={!!errors.tipoTutor}>
                  <InputLabel>Selecciona el tutor</InputLabel>
                  <Select
                    value={formData.tipoTutor || ''}
                    onChange={handleChange}
                    label="Selecciona el tutor"
                    name="tipoTutor"
                  >
                    <MenuItem value="Madre">Madre</MenuItem>
                    <MenuItem value="Padre">Padre</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                  {errors.tipoTutor && <FormHelperText>{errors.tipoTutor}</FormHelperText>}
                </FormControl>

                {formData.tipoTutor === 'Otro' && (
                  <TextField
                    fullWidth
                    label="Especificar relación con el menor"
                    name="relacionTutor"
                    value={formData.relacionTutor || ''}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={!!errors.relacionTutor}
                    helperText={
                      errors.relacionTutor || 'Por ejemplo, tío, primo, vecino, etc.'
                    }
                  />
                )}

                <TextField
                  fullWidth
                  label="Nombre del Tutor"
                  name="nombreTutor"
                  value={formData.nombreTutor || ''}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.nombreTutor}
                  helperText={errors.nombreTutor || 'Escribe el nombre del tutor'}
                />
              </Box>
            )}

            {/* Campo de Género */}
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
                <MenuItem value="Prefiero no decirlo">Prefiero no decirlo</MenuItem>
              </Select>
              {errors.genero && <FormHelperText>{errors.genero}</FormHelperText>}
            </FormControl>

            {/* Campo de Lugar de Procedencia */}
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

            {/* Campo Especificar Lugar */}
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
                helperText={errors.otroLugar || 'Escribe el lugar específico'}
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
                  <InputLabel>Alergias</InputLabel>
                  <Select
                    multiple
                    value={formData.alergias}
                    onChange={(e) => {
                      const { value } = e.target;

                      // Si seleccionas "Ninguna", deselecciona todas las demás
                      if (value.includes('Ninguna')) {
                        setFormData({
                          ...formData,
                          alergias: ['Ninguna'],
                        });
                      } else {
                        // Remover "Ninguna" si se seleccionan otras alergias
                        setFormData({
                          ...formData,
                          alergias: typeof value === 'string' ? value.split(',') : value.filter((alergia) => alergia !== 'Ninguna'),
                        });
                      }
                    }}
                    label="Alergias"
                    name="alergias"
                    renderValue={(selected) => selected.join(', ')} // Muestra las alergias seleccionadas
                  >
                    <MenuItem value="Ninguna">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        Ninguna
                        {formData.alergias.includes('Ninguna') ? (
                          <FaCheckCircle style={{ color: 'blue' }} /> // Palomita azul si está seleccionada
                        ) : (
                          <FaPlusCircle /> // Símbolo de "+" si no está seleccionada
                        )}
                      </div>
                    </MenuItem>

                    {Object.keys(alergiasInfo).map((alergia) => (
                      <MenuItem key={alergia} value={alergia} disabled={formData.alergias.includes('Ninguna')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          {alergia}
                          {formData.alergias.includes(alergia) ? (
                            <FaCheckCircle style={{ color: 'blue' }} /> // Palomita azul si está seleccionada
                          ) : (
                            <FaPlusCircle /> // Símbolo de "+" si no está seleccionada
                          )}
                        </div>
                      </MenuItem>
                    ))}

                    <MenuItem value="Otro" disabled={formData.alergias.includes('Ninguna')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        Otro
                      </div>
                    </MenuItem>
                  </Select>

                  {/* Mostrar información sobre la alergia seleccionada si está en alergiasInfo */}
                  {formData.alergias.some((alergia) => alergiasInfo[alergia]) && (
                    <Typography variant="caption" sx={{ color: 'gray', display: 'flex', alignItems: 'center', mt: 1 }}>
                      <FaInfoCircle style={{ marginRight: '5px' }} /> {alergiasInfo[formData.alergias.find((alergia) => alergiasInfo[alergia])]}
                    </Typography>
                  )}

                  <FormHelperText>Puedes seleccionar más de una alergia</FormHelperText>
                  {errors.alergias && <FormHelperText>{errors.alergias}</FormHelperText>}

                  {formData.alergias.includes('Otro') && (
                    <TextField
                      fullWidth
                      label="Especificar Alergia"
                      name="otraAlergia"
                      value={formData.otraAlergia}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!errors.otraAlergia} // Mostrar el error si está definido
                      helperText={errors.otraAlergia} // Mostrar mensaje de error si existe
                    />
                  )}

                </FormControl>
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
              type={showPassword ? 'text' : 'password'}  // Alterna entre 'text' y 'password'
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
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}  {/* Cambia el ícono */}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}  // Alterna entre 'text' y 'password'
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
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}  {/* Cambia el ícono */}
                    </Button>
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
    <Container maxWidth="md" sx={{ mt: 6, mb: 14 }}> {/* Aquí agregamos marginTop y marginBottoom */}
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
            Registro
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

            {/* Contenedor para los botones y checkboxes */}
            <Box sx={{ mt: 4 }}>
              {activeStep === steps.length - 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  {/* Checkbox para la aceptación de términos y política */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allAccepted}
                        onChange={handleAcceptChange}
                        name="acceptAll"
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Al registrarte, confirmas que estás de acuerdo con nuestros{' '}
                        <Link
                          component="span"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenTermsModal(e);  // Evita el click en el checkbox
                          }}
                          sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
                        >
                          términos y condiciones
                        </Link>{' '}
                        y que entiendes nuestra{' '}
                        <Link
                          component="span"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenPrivacyModal(e);  // Evita el click en el checkbox
                          }}
                          sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
                        >
                          política de privacidad
                        </Link>.
                      </Typography>
                    }
                  />
                </Box>
              )}

              {/* Contenedor de botones para Navegar y Enviar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 2 }} disabled={isLoading}>
                    Regresar
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ px: 4 }}
                    disabled={isLoading || !allAccepted} // Deshabilitar si no se aceptan los términos
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Registrar'}
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext} sx={{ px: 4 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Siguiente'}
                  </Button>
                )}
              </Box>
            </Box>

            {/* Modal para Políticas de Privacidad */}
            <Modal open={openPrivacyModal} onClose={handleClosePrivacyModal}>
              <Box sx={{ width: '80%', maxWidth: 600, bgcolor: 'background.paper', p: 4, m: 'auto', mt: 5, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Políticas de Privacidad</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>{privacyPolicy}</Typography>
                <Button onClick={handleClosePrivacyModal} sx={{ mt: 2 }} variant="contained">Cerrar</Button>
              </Box>
            </Modal>

            {/* Modal para Términos y Condiciones */}
            <Modal open={openTermsModal} onClose={handleCloseTermsModal}>
              <Box sx={{ width: '80%', maxWidth: 600, bgcolor: 'background.paper', p: 4, m: 'auto', mt: 5, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Términos y Condiciones</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>{termsConditions}</Typography>
                <Button onClick={handleCloseTermsModal} sx={{ mt: 2 }} variant="contained">Cerrar</Button>
              </Box>
            </Modal>
          </form>


        </CardContent>
      </Card>
    </Container>
  );

};

export default Register;
