import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, MenuItem, Checkbox, FormControlLabel, Modal, Backdrop, Fade, Link } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ReservaCitas = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    genero: '',
    fechaNacimiento: '',
    ciudad: '',
    telefono: '',
    aceptaTerminos: false,
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateClick = (date) => setSelectedDate(date);
  const handleTimeClick = (time) => setSelectedTime(time);

  const handleReservar = () => {
    alert(`Cita reservada para el día ${selectedDate} a las ${selectedTime}`);
    setStep(1);
  };

  const handleOpenPrivacyModal = async (event) => {
    event.stopPropagation();
    if (!privacyPolicy) await fetchPrivacyPolicy();
    setOpenPrivacyModal(true);
  };

  const handleOpenTermsModal = async (event) => {
    event.stopPropagation();
    if (!termsConditions) await fetchTermsConditions();
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

  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(matchDarkTheme.matches);

    const handleThemeChange = (e) => setIsDarkTheme(e.matches);
    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: isDarkTheme ? '#1A2A3A' : '#FFFFFF',
        color: isDarkTheme ? '#FFFFFF' : '#000000',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" sx={{ mb: 6, textAlign: 'center' }}>
          {step === 1 ? 'Identificación del Paciente' : 'Reserva de Cita'}
        </Typography>
      </motion.div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              maxWidth: { xs: '100%', sm: '600px' },
              margin: 'auto',
              padding: '20px',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: isDarkTheme ? '#2A3A4A' : '#FFFFFF',
            }}
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nombre legal"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            {/* Campos restantes */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.aceptaTerminos}
                    onChange={(e) =>
                      setFormData({ ...formData, aceptaTerminos: e.target.checked })
                    }
                    name="acceptAll"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Al registrarte, confirmas que estás de acuerdo con nuestros{' '}
                    <Link
                      component="span"
                      onClick={(e) => handleOpenTermsModal(e)}
                      sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
                    >
                      términos y condiciones
                    </Link>{' '}
                    y que entiendes nuestra{' '}
                    <Link
                      component="span"
                      onClick={(e) => handleOpenPrivacyModal(e)}
                      sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
                    >
                      política de privacidad
                    </Link>.
                  </Typography>
                }
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setStep(2)}
              disabled={!formData.aceptaTerminos}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Continuar
            </Button>
          </Box>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              maxWidth: { xs: '100%', sm: '600px' },
              margin: 'auto',
              padding: '20px',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: isDarkTheme ? '#2A3A4A' : '#FFFFFF',
            }}
          >
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
              Selecciona Disponibilidad
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              {['9', '10', '11', '12', '13'].map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? 'contained' : 'outlined'}
                  onClick={() => handleDateClick(date)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: selectedDate === date ? 'primary.main' : 'transparent',
                    color: selectedDate === date ? '#FFFFFF' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {`Día ${date}`}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
              {['16:00', '17:00', '18:00'].map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  onClick={() => handleTimeClick(time)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: selectedTime === time ? 'primary.main' : 'transparent',
                    color: selectedTime === time ? '#FFFFFF' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {time}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setStep(1)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleReservar}
                disabled={!selectedDate || !selectedTime}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Reservar
              </Button>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Modal de políticas de privacidad */}
      <Modal
        open={openPrivacyModal}
        onClose={handleClosePrivacyModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openPrivacyModal}>
          <Box
            sx={{
              maxWidth: 500,
              margin: 'auto',
              mt: '20%',
              p: 4,
              backgroundColor: isDarkTheme ? '#2A3A4A' : '#FFFFFF',
              borderRadius: 2,
              color: isDarkTheme ? '#FFFFFF' : '#000000',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Política de Privacidad
            </Typography>
            <Typography variant="body1">{privacyPolicy}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
              onClick={handleClosePrivacyModal}
            >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de términos y condiciones */}
      <Modal
        open={openTermsModal}
        onClose={handleCloseTermsModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openTermsModal}>
          <Box
            sx={{
              maxWidth: 500,
              margin: 'auto',
              mt: '20%',
              p: 4,
              backgroundColor: isDarkTheme ? '#2A3A4A' : '#FFFFFF',
              borderRadius: 2,
              color: isDarkTheme ? '#FFFFFF' : '#000000',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Términos y Condiciones
            </Typography>
            <Typography variant="body1">{termsConditions}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
              onClick={handleCloseTermsModal}
            >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ReservaCitas;