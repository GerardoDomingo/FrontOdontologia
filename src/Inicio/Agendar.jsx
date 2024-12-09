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
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Validation Regex
const nameRegex = /^[A-Za-zÀ-ÿñÑà-ü\s]+$/;
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
    
    // Validar campo
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateStep = () => {
    const newErrors = {};
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

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
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
        pb: 4 
      }}
    >
      {/* Encabezado azul */}
      <Box 
        sx={{ 
          backgroundColor: '#1976d2', 
          color: '#fff', 
          py: 2, 
          textAlign: 'center',
          mt: 2,
          boxShadow: 2
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

      {/* Contenido del Formulario */}
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
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Atrás
                </Button>
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

          {step === 2 && (
            <Box
              sx={{
                width: '80%',
                mx: 'auto',
                backgroundColor: '#fff',
                borderRadius: 2,
                p: 4,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ mb: 3 }}>
                Profesional Disponible
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src="https://via.placeholder.com/150"
                  alt="Doctor"
                  style={{ borderRadius: '50%', marginBottom: '20px' }}
                />
                <Typography variant="h6">Dr(a). María López</Typography>
                <Typography variant="body1">Teléfono: 555-555-5555</Typography>
                <Typography variant="body1">Especialidad: Ortodoncia</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => setStep(1)}
                  sx={{ mr: 2, textTransform: 'none' }}
                >
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setStep(3)}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          )}

          {step === 3 && (
            <Box
              sx={{
                width: '80%',
                mx: 'auto',
                backgroundColor: '#fff',
                borderRadius: 2,
                p: 4,
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                Selecciona Disponibilidad
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {["9", "10", "11", "12", "13"].map((date) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "contained" : "outlined"}
                    onClick={() => setSelectedDate(date)}
                    sx={{ m: 1 }}
                  >
                    {`Día ${date}`}
                  </Button>
                ))}
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                {["16:00", "17:00", "18:00"].map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "contained" : "outlined"}
                    onClick={() => setSelectedTime(time)}
                    sx={{ m: 1 }}
                  >
                    {time}
                  </Button>
                ))}
              </Box>
              <Box sx={{ textAlign: 'right', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => setStep(2)}
                  sx={{ mr: 2, textTransform: 'none' }}
                >
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReservar}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  disabled={!selectedDate || !selectedTime}
                >
                  Reservar
                </Button>
              </Box>
            </Box>
          )}

          {step === 4 && (
            <Box
              sx={{
                width: '80%',
                mx: 'auto',
                backgroundColor: '#fff',
                borderRadius: 2,
                p: 4,
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ mb: 3 }}>
                Confirmación
              </Typography>
              <Typography>
                Su solicitud de cita ha sido enviada. El médico será notificado y se le confirmará
                la disponibilidad.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep(1)}
                sx={{ mt: 4, textTransform: 'none', fontWeight: 'bold' }}
              >
                Volver al inicio
              </Button>
            </Box>
          )}
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
