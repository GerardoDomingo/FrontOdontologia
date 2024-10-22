import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

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
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Reporte de Intentos de Login</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
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
                  <Button variant="contained" color="primary" onClick={() => handleMoreInfo(attempt.paciente_id)}>
                    Más información
                  </Button>
                </TableCell>
                <TableCell>{attempt.fecha_hora}</TableCell>
                <TableCell>{attempt.intentos_fallidos}</TableCell>
                <TableCell>{attempt.fecha_bloqueo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para mostrar la información del paciente */}
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Información del Paciente</DialogTitle>
        <DialogContent>
          {selectedPaciente ? (
            <Box>
              <Typography><strong>Nombre:</strong> {selectedPaciente.nombre} {selectedPaciente.aPaterno} {selectedPaciente.aMaterno}</Typography>
              <Typography><strong>Edad:</strong> {selectedPaciente.edad}</Typography>
              <Typography><strong>Género:</strong> {selectedPaciente.genero}</Typography>
              <Typography><strong>Email:</strong> {selectedPaciente.email}</Typography>
              <Typography><strong>Teléfono:</strong> {selectedPaciente.telefono}</Typography>
              <Typography><strong>Alergias:</strong> {selectedPaciente.alergias}</Typography>
              <Typography><strong>Estado:</strong> {selectedPaciente.estado}</Typography>
              {/* Otros detalles que quieras mostrar */}
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
