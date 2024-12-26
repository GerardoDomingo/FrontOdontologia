import {
  Avatar, Box, Button, Card, CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaEnvelope,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaSearch,
  FaSyringe,
  FaTimes,
  FaUserCheck,
  FaVenusMars
} from 'react-icons/fa';

const PatientsReport = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [open, setOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [patientToUpdate, setPatientToUpdate] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Configuración del tema oscuro
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(matchDarkTheme.matches);
    const handleThemeChange = (e) => {
      setIsDarkTheme(e.matches);
    };
    matchDarkTheme.addEventListener('change', handleThemeChange);
    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
  }, []);

  // Definición de colores
  const colors = {
    background: isDarkTheme ? '#1B2A3A' : '#F9FDFF',
    paper: isDarkTheme ? '#243447' : '#ffffff',
    tableBackground: isDarkTheme ? '#1E2A3A' : '#e3f2fd',
    text: isDarkTheme ? '#FFFFFF' : '#333333',
    secondaryText: isDarkTheme ? '#E8F1FF' : '#666666',
    primary: isDarkTheme ? '#4B9FFF' : '#1976d2',
    hover: isDarkTheme ? 'rgba(75,159,255,0.15)' : 'rgba(25,118,210,0.1)',
    inputBorder: isDarkTheme ? '#4B9FFF' : '#1976d2',
    inputLabel: isDarkTheme ? '#E8F1FF' : '#666666'
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/reportes/pacientes');
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'No disponible';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha inválida';
    }
  };
  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  // Función para formatear las alergias
  const formatAlergias = (alergias) => {
    if (!alergias) return 'Ninguna alergia';
    try {
      // Si es un string con formato de array, intentar parsearlo
      const alergiasArray = typeof alergias === 'string' ?
        JSON.parse(alergias.replace(/'/g, '"')) : alergias;
      return Array.isArray(alergiasArray) ?
        alergiasArray.join(', ') : 'Ninguna alergia';
    } catch {
      // Si hay error en el parsing, mostrar el texto tal cual
      return alergias;
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    filterPatients(searchValue, statusFilter);
  };

  // Función para manejar el filtro de estado
  const handleStatusFilter = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    filterPatients(searchTerm, status);
  };

  // Estado chip colors
  const getStatusColor = (status) => {
    const statusColors = {
      'Activo': {
        bg: '#E6F4EA', // Verde muy suave
        text: '#1B873F', // Verde oscuro
        border: '#A6E9B9' // Verde medio
      },
      'Inactivo': {
        bg: '#FEE2E2', // Rojo muy suave
        text: '#DC2626', // Rojo oscuro
        border: '#FECACA' // Rojo medio
      },
      'Pendiente': {
        bg: '#FEF3C7', // Amarillo muy suave
        text: '#D97706', // Amarillo oscuro
        border: '#FDE68A' // Amarillo medio
      }
    };

    return statusColors[status] || {
      bg: '#F1F5F9', // Gris muy suave por defecto
      text: '#64748B', // Gris oscuro por defecto
      border: '#CBD5E1' // Gris medio por defecto
    };
  };

  // Función para cambiar estado
  const handleStatusChange = async (patient, newStatus) => {
    setPatientToUpdate(patient);
    setOpenConfirmDialog(true);
  };

  // Función para confirmar cambio de estado
  const handleConfirmStatusChange = async () => {
    if (confirmName === `${patientToUpdate.nombre} ${patientToUpdate.aPaterno}`) {
      try {
        // Verificar que patientToUpdate.id existe
        if (!patientToUpdate?.id) {
          setNotificationMessage('Error: ID de paciente no válido');
          setNotificationType('error');
          return;
        }
  
        const response = await axios.put(
          `https://backendodontologia.onrender.com/api/pacientes/${patientToUpdate.id}/status`,
          { estado: 'Inactivo' }
        );
  
        if (response.data.success) {
          // Actualizar el estado local
          const updatedPatients = patients.map(p =>
            p.id === patientToUpdate.id ? { ...p, estado: 'Inactivo' } : p
          );
          setPatients(updatedPatients);
          setFilteredPatients(updatedPatients);
          
          setNotificationMessage('Estado del paciente actualizado exitosamente');
          setNotificationType('success');
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error completo:', error);
        setNotificationMessage(
          error.response?.data?.message || 
          'Error al actualizar el estado del paciente'
        );
        setNotificationType('error');
      } finally {
        setOpenConfirmDialog(false);
        setConfirmName('');
        setPatientToUpdate(null);
        setNotificationOpen(true);
      }
    } else {
      setNotificationMessage('El nombre no coincide. Por favor, inténtelo de nuevo.');
      setNotificationType('error');
      setNotificationOpen(true);
    }
  };

  // Función para filtrar pacientes
  const filterPatients = (search, status) => {
    let filtered = patients.filter(patient => {
      const matchesSearch =
        patient.nombre.toLowerCase().includes(search) ||
        patient.aPaterno.toLowerCase().includes(search) ||
        patient.aMaterno.toLowerCase().includes(search) ||
        patient.email.toLowerCase().includes(search) ||
        patient.telefono.includes(search);

      const matchesStatus = status === 'todos' || patient.estado === status;

      return matchesSearch && matchesStatus;
    });

    setFilteredPatients(filtered);
  };

  return (
    <Card
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC', // Fondo muy suave
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}> {/* Padding responsivo */}
        <Typography
          variant="h5"
          sx={{
            marginBottom: 3,
            fontWeight: 600,
            color: '#0052A3', // Gris azulado oscuro
            fontFamily: 'Roboto, sans-serif',
            textAlign: { xs: 'center', sm: 'left' } // Centrado en móvil, izquierda en desktop
          }}
        >
          Gestión de Pacientes
        </Typography>

        {/* Filtros y Búsqueda */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar paciente"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch color={colors.primary} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: colors.paper,
                '& .MuiOutlinedInput-root': {
                  color: colors.text,
                  '& fieldset': {
                    borderColor: colors.inputBorder,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.inputLabel,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.inputLabel }}>
                Filtrar por estado
              </InputLabel>
              <Select
                value={statusFilter}
                label="Filtrar por estado"
                onChange={handleStatusFilter}
                sx={{
                  backgroundColor: colors.paper,
                  color: colors.text,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.inputBorder,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary,
                  },
                }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: isDarkTheme ? '0px 4px 20px rgba(0, 0, 0, 0.3)' : '0px 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: colors.paper,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: colors.tableBackground }}>
              <TableRow>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Correo</TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Teléfono</TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Fecha de Registro</TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient, index) => (
                <TableRow key={index} sx={{
                  '&:hover': {
                    backgroundColor: colors.hover
                  },
                  transition: 'background-color 0.2s ease'
                }}>
                  <TableCell sx={{ color: colors.text }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: colors.text }}>
                    {`${patient.nombre || ''} ${patient.aPaterno || ''} ${patient.aMaterno || ''}`}
                  </TableCell>
                  <TableCell sx={{ color: colors.text }}>{patient.email || 'No disponible'}</TableCell>
                  <TableCell sx={{ color: colors.text }}>{patient.telefono || 'No disponible'}</TableCell>
                  <TableCell>
                    <Chip
                      label={patient.estado || 'No definido'}
                      sx={{
                        backgroundColor: getStatusColor(patient.estado).bg,
                        color: getStatusColor(patient.estado).text,
                        border: `1px solid ${getStatusColor(patient.estado).border}`,
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        height: '28px',
                        '&:hover': {
                          backgroundColor: getStatusColor(patient.estado).bg,
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: colors.text }}>
                    {patient.fecha_Creacion ?
                      format(new Date(patient.fecha_Creacion), 'dd/MM/yyyy HH:mm', { locale: es })
                      : 'No disponible'
                    }
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<FaInfoCircle />}
                        onClick={() => handleOpenModal(patient)}
                        sx={{
                          backgroundColor: colors.primary,
                          '&:hover': {
                            backgroundColor: colors.hover
                          }
                        }}
                      >
                        Ver detalles
                      </Button>
                      {patient.estado === 'Activo' && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleStatusChange(patient)}
                          sx={{
                            backgroundColor: '#f44336',
                            '&:hover': {
                              backgroundColor: '#d32f2f'
                            }
                          }}
                        >
                          Dar de baja
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Diálogo de confirmación */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: colors.paper,
              color: colors.text
            }
          }}
        >
          <DialogTitle sx={{ color: colors.primary }}>
            Confirmar cambio de estado
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: colors.text, mb: 2 }}>
              Para confirmar la baja del paciente, por favor escriba su nombre completo:
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                {patientToUpdate ? `${patientToUpdate.nombre} ${patientToUpdate.aPaterno}` : ''}
              </Typography>
            </DialogContentText>
            <TextField
              fullWidth
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              label="Nombre del paciente"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.text,
                  '& fieldset': {
                    borderColor: colors.inputBorder,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.inputLabel,
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              sx={{ color: colors.text }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              variant="contained"
              color="error"
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: colors.paper,
              color: colors.text
            }
          }}
        >
          <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: colors.primary
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Información del Paciente
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ color: colors.text }}
            >
              <FaTimes />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedPatient && (
              <Box sx={{ p: 2 }}>
                <Card sx={{
                  mb: 3,
                  boxShadow: isDarkTheme ? '0px 4px 20px rgba(0, 0, 0, 0.3)' : '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  backgroundColor: colors.paper
                }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            bgcolor: colors.primary,
                            color: '#fff',
                            fontSize: '2rem'
                          }}
                        >
                          {selectedPatient.nombre.charAt(0)}
                        </Avatar>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 2 }}>
                          {`${selectedPatient.nombre} ${selectedPatient.aPaterno} ${selectedPatient.aMaterno}`}
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FaPhone style={{ marginRight: 8, color: colors.primary }} />
                              <Typography sx={{ color: colors.text }}>{selectedPatient.telefono}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FaEnvelope style={{ marginRight: 8, color: colors.primary }} />
                              <Typography sx={{ color: colors.text }}>{selectedPatient.email}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FaCalendarAlt style={{ marginRight: 8, color: colors.primary }} />
                              <Typography sx={{ color: colors.text }}>
                                {selectedPatient.fechaNacimiento ?
                                  formatDate(selectedPatient.fechaNacimiento)
                                  : 'No disponible'
                                }
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FaVenusMars style={{ marginRight: 8, color: colors.primary }} />
                              <Typography sx={{ color: colors.text }}>{selectedPatient.genero}</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FaMapMarkerAlt style={{ marginRight: 8, color: colors.primary }} />
                      <Typography sx={{ color: colors.text }}>{selectedPatient.lugar}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FaSyringe style={{ marginRight: 8, color: colors.primary }} />
                      <Typography sx={{ color: colors.text }}>
                        {formatAlergias(selectedPatient.alergias)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FaUserCheck style={{ marginRight: 8, color: colors.primary }} />
                      <Typography sx={{ color: colors.text }}>{selectedPatient.estado}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Card>

  );
};

export default PatientsReport;