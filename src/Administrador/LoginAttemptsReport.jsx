import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, Grid, IconButton, Card, CardContent, Avatar, TextField } from '@mui/material';
import { FaInfoCircle, FaTimes, FaIdCard, FaCalendarAlt, FaPhone, FaEnvelope } from 'react-icons/fa'; // Íconos
import { format } from 'date-fns';
import Notificaciones from '../Compartidos/Notificaciones'; // Importar Notificaciones

const LoginAttemptsReport = () => {
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null); // Para almacenar el paciente seleccionado
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Estado para controlar el modal
  const [maxAttempts, setMaxAttempts] = useState(''); // Estado para los intentos máximos
  const [lockTimeMinutes, setLockTimeMinutes] = useState(''); // Estado para el tiempo de bloqueo
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si se está en modo edición
  const [notificationOpen, setNotificationOpen] = useState(false); // Controlar notificación
  const [notificationMessage, setNotificationMessage] = useState(''); // Mensaje de notificación
  const [notificationType, setNotificationType] = useState('success'); // Tipo de notificación

  // Obtener los intentos de login y la configuración
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
        const sortedAttempts = data.attempts.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)); // Ordenar por más reciente
        setLoginAttempts(sortedAttempts);

        // Establecer el valor de intentos máximos y tiempo de bloqueo
        setMaxAttempts(data.maxAttempts);
        setLockTimeMinutes(data.lockTimeMinutes);
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

  // Función para iniciar el modo de edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Función para guardar la configuración actualizada (intentos máximos y tiempo de bloqueo)
  const handleSaveConfig = async () => {
    try {
      const response1 = await fetch('https://backendodontologia.onrender.com/api/reportes/update-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settingName: 'MAX_ATTEMPTS', settingValue: maxAttempts }),
      });

      const response2 = await fetch('https://backendodontologia.onrender.com/api/reportes/update-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settingName: 'LOCK_TIME_MINUTES', settingValue: lockTimeMinutes }),
      });

      if (response1.ok && response2.ok) {
        setNotificationMessage('Configuración actualizada exitosamente');
        setNotificationType('success');
        setIsEditing(false);
      } else {
        setNotificationMessage('Error al actualizar la configuración');
        setNotificationType('error');
      }
      setNotificationOpen(true); // Mostrar notificación
    } catch (err) {
      setNotificationMessage('Error al actualizar la configuración');
      setNotificationType('error');
      setNotificationOpen(true); // Mostrar notificación
    }
  };

  // Función para cancelar la edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNotificationMessage('');
  };

  // Función para cerrar notificación
  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  // Validación para permitir solo números positivos
  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#1565c0' }}>
        Reporte de Intentos de Login
      </Typography>

      {/* Campos para intentos máximos y tiempo de bloqueo */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Intentos máximos permitidos"
          value={maxAttempts}
          onChange={handleInputChange(setMaxAttempts)}
          fullWidth
          sx={{ mb: 2 }}
          disabled={!isEditing}
        />
        <TextField
          label="Tiempo de bloqueo (minutos)"
          value={lockTimeMinutes}
          onChange={handleInputChange(setLockTimeMinutes)}
          fullWidth
          sx={{ mb: 2 }}
          disabled={!isEditing}
        />

        {/* Botones para editar, guardar y cancelar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {!isEditing ? (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Editar
            </Button>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleSaveConfig}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Mostrar notificación */}
      <Notificaciones
        open={notificationOpen}
        message={notificationMessage}
        type={notificationType}
        handleClose={handleCloseNotification}
      />

      {/* Tabla de intentos de login */}
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
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>Información del Paciente</Typography>
          <IconButton aria-label="close" onClick={handleClose} sx={{ color: '#555' }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPaciente ? (
            <Box sx={{ p: 2 }}>
              <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar sx={{ width: 100, height: 100, bgcolor: '#1565c0', color: '#fff', fontSize: '2rem' }}>
                        {selectedPaciente.nombre.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 1 }}>
                        {selectedPaciente.nombre} {selectedPaciente.aPaterno} {selectedPaciente.aMaterno}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}><FaIdCard /> <strong>ID:</strong> {selectedPaciente.id}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}><FaCalendarAlt /> <strong>Edad:</strong> {selectedPaciente.edad}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}><FaEnvelope /> <strong>Email:</strong> {selectedPaciente.email}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}><FaPhone /> <strong>Teléfono:</strong> {selectedPaciente.telefono}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Grid container spacing={2}>
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
