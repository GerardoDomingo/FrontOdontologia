import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button, 
  MenuItem, 
  Stepper, 
  Step, 
  StepLabel, 
  Grid, 
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  LocationOn as LocationOnIcon, 
  CalendarMonth as CalendarMonthIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Validation Regex
const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\u00e0-\u00fc\s]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|live|uthh\.edu)\.(com|mx)$/;
const phoneRegex = /^\d{10}$/;

const steps = ['Identificación', 'Profesional', 'Disponibilidad', 'Confirmación'];

const ReservaCitas = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    genero: '',
    correo: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'nombre':
      case 'apellidos':
        if (!nameRegex.test(value)) {
          errorMessage = 'Solo se permiten letras y espacios';
        }
        break;
      case 'correo':
        if (!emailRegex.test(value)) {
          errorMessage = 'Correo electrónico inválido';
        }
        break;
      case 'telefono':
        if (!phoneRegex.test(value)) {
          errorMessage = 'Debe contener 10 dígitos';
        }
        break;
      default:
        if (!value.trim()) {
          errorMessage = 'Este campo es obligatorio';
        }
    }
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    
    // Validate all fields in current step
    Object.keys(formData).forEach(key => {
      const errorMessage = validateField(key, formData[key]);
      if (errorMessage) {
        newErrors[key] = errorMessage;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handleReservar = () => {
    if (selectedDate && selectedTime) {
      setOpenConfirmDialog(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      nombre: '',
      apellidos: '',
      genero: '',
      correo: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    });
    setSelectedDate('');
    setSelectedTime('');
    setErrors({});
    setOpenConfirmDialog(false);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0f4f8', 
        position: 'relative',
        pb: 4 
      }}
    >
      {/* Exit/Home Button */}
      <Button 
        variant="contained" 
        color="error"
        onClick={handleReset}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 10,
          borderRadius: '50%',
          minWidth: '48px',
          height: '48px',
          p: 0
        }}
      >
        <CloseIcon />
      </Button>

      {/* Blue Header */}
      <Box 
        sx={{ 
          backgroundColor: '#1976d2', 
          color: '#fff', 
          py: 3, 
          textAlign: 'center',
          boxShadow: 3
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Reserva de Citas Médicas
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ width: '90%', maxWidth: '800px', mx: 'auto', my: 4 }}>
        <Stepper activeStep={step - 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: '600px',
            mx: 'auto',
            backgroundColor: '#fff',
            borderRadius: 3,
            p: 4,
            boxShadow: 4,
          }}
        >
          {step === 1 && (
            <>
              <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', color: '#1976d2' }}>
                Identificación del Paciente
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    error={!!errors.apellidos}
                    helperText={errors.apellidos}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Género"
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    required
                    error={!!errors.genero}
                    helperText={errors.genero}
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    error={!!errors.correo}
                    helperText={errors.correo}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img 
                            src="https://flagcdn.com/w20/mx.png" 
                            alt="Mexico Flag" 
                            style={{ marginRight: 8 }}
                          />
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    error={!!errors.asunto}
                    helperText={errors.asunto}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    error={!!errors.mensaje}
                    helperText={errors.mensaje}
                  />
                </Grid>
              </Grid>
              <Box sx={{ textAlign: 'right', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextStep}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Continuar
                </Button>
              </Box>
            </>
          )}

          {/* Similar modifications for other steps... */}
        </Box>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>
          <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Confirmación de Cita
        </DialogTitle>
        <DialogContent>
          <Typography>
            Su solicitud de cita ha sido enviada con éxito. 
            El médico será notificado y se le confirmará la disponibilidad.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleReset} 
            color="primary" 
            variant="contained"
          >
            Volver al Inicio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservaCitas;