import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';

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
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateClick = (date) => setSelectedDate(date);
  const handleTimeClick = (time) => setSelectedTime(time);

  const handleReservar = () => {
    setStep(4); // Paso de confirmación
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f9fc', color: '#000', pb: 4 }}>
      {/* Encabezado azul */}
      <Box sx={{ backgroundColor: '#1976d2', color: '#fff', py: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          ZURIT DENTAL STUDIO
        </Typography>
        <Typography>Reserva de horas</Typography>
      </Box>

      {/* Barra de pasos */}
      <Box sx={{ width: '80%', mx: 'auto', my: 4 }}>
        <Stepper activeStep={step - 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Formulario de pasos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 1 && (
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
            <Typography variant="h5" sx={{ mb: 3 }}>
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
                />
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'right', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep(2)}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Continuar
              </Button>
            </Box>
          </Box>
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
              {['9', '10', '11', '12', '13'].map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'contained' : 'outlined'}
                  onClick={() => handleDateClick(date)}
                  sx={{ m: 1 }}
                >
                  {`Día ${date}`}
                </Button>
              ))}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              {['16:00', '17:00', '18:00'].map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  onClick={() => handleTimeClick(time)}
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
      </motion.div>
    </Box>
  );
};

export default ReservaCitas;
