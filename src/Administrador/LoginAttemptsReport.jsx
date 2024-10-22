import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, Grid, IconButton } from '@mui/material';
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaInfoCircle, FaTimes } from 'react-icons/fa'; // Íconos
import { format } from 'date-fns';

const LoginAttemptsReport = () => {
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null); // Para almacenar el paciente seleccionado
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    const fetchLoginAttempts = async () => {
      try {
        const response = await fetch('https://backendodontologia.onrender.com/api/reportes/login-attempts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los intentos de login');
        }

        const data = await response.json();
        const sortedAttempts = data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)); // Ordenar por más reciente
        setLoginAttempts(sortedAttempts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLoginAttempts();
  }, []);

  // Función para obtener los detalles del paciente
  const handleMoreInfo = async (pacienteId) => {
    try {
      const response = await fetch(`https://backendodontologia.onrender.com/api/reportes/paciente/${pacienteId}`);
      if (!response.ok) {
        throw new Error('Error al obtener la información del paciente');
      }

      const paciente = await response.json();
      setSelectedPaciente(paciente); // Guardar el paciente seleccionado
      setOpen(true); // Abrir el modal
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para cerrar el modal
  const handleClose = () => {
    setOpen(false);
    setSelectedPaciente(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1565c0' }}>Reporte de Intentos de Login</Typography>
      <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Paciente ID</TableCell>
              <TableCell>Fecha/Hora</TableCell>
              <TableCell>Intentos Fallidos</TableCell>
              <TableCell>Fecha Bloqueo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loginAttempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell>{attempt.id}</TableCell>
                <TableCell>{attempt.ip_address}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" startIcon={<FaInfoCircle />} onClick={() => handleMoreInfo(attempt.paciente_id)}>
                    Más información
                  </Button>
                </TableCell>
                <TableCell>{format(new Date(attempt.fecha_hora), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                <TableCell>{attempt.intentos_fallidos}</TableCell>
                <TableCell>{attempt.fecha_bloqueo ? format(new Date(attempt.fecha_bloqueo), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para mostrar la información del paciente */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Información del Paciente
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#555' }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPaciente ? (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ mb: 1 }}><FaUser /> {selectedPaciente.nombre} {selectedPaciente.aPaterno} {selectedPaciente.aMaterno}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}><FaCalendarAlt /> <strong>Edad:</strong> {selectedPaciente.edad}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}><FaEnvelope /> <strong>Email:</strong> {selectedPaciente.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}><FaPhone /> <strong>Teléfono:</strong> {selectedPaciente.telefono}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Alergias:</strong> {selectedPaciente.alergias}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Estado:</strong> {selectedPaciente.estado}</Typography>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography>Cargando información...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoginAttemptsReport;
