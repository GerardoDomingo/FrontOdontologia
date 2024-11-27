import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { FaInfoCircle } from 'react-icons/fa'; // Ícono para "Más información"
import axios from 'axios';

const PatientsReport = () => {
  const [patients, setPatients] = useState([]); // Estado para los datos de los pacientes
  const [selectedPatient, setSelectedPatient] = useState(null); // Paciente seleccionado para mostrar en el modal
  const [openModal, setOpenModal] = useState(false); // Estado para abrir/cerrar el modal

  // Obtener datos de pacientes desde el backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/reportes/pacientes');
        setPatients(response.data);
      } catch (error) {
        console.error('Error al obtener los pacientes:', error);
      }
    };

    fetchPatients();
  }, []);

  // Manejar la apertura del modal
  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setSelectedPatient(null);
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Título */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: '#1976d2',
          fontFamily: 'Roboto, sans-serif',
          textAlign: 'center',
        }}
      >
        Reporte de Pacientes
      </Typography>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre Completo</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Más Información</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>
                  {`${patient.nombre} ${patient.aPaterno} ${patient.aMaterno}`}
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.telefono}</TableCell>
                <TableCell>{patient.estado}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(patient)}
                  >
                    <FaInfoCircle />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para mostrar detalles del paciente */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Card
          sx={{
            maxWidth: 600,
            margin: 'auto',
            mt: 8,
            borderRadius: '16px',
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <CardContent>
            {selectedPatient ? (
              <>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Información Detallada del Paciente
                </Typography>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedPatient.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Nombre:</strong> {`${selectedPatient.nombre} ${selectedPatient.aPaterno} ${selectedPatient.aMaterno}`}
                </Typography>
                <Typography variant="body1">
                  <strong>Fecha de Nacimiento:</strong> {selectedPatient.fechaNacimiento}
                </Typography>
                <Typography variant="body1">
                  <strong>Teléfono:</strong> {selectedPatient.telefono}
                </Typography>
                <Typography variant="body1">
                  <strong>Correo Electrónico:</strong> {selectedPatient.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Género:</strong> {selectedPatient.genero}
                </Typography>
                <Typography variant="body1">
                  <strong>Lugar:</strong> {selectedPatient.lugar}
                </Typography>
                <Typography variant="body1">
                  <strong>Alergias:</strong> {selectedPatient.alergias}
                </Typography>
                <Typography variant="body1">
                  <strong>Estado:</strong> {selectedPatient.estado}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 4 }}
                  onClick={handleCloseModal}
                >
                  Cerrar
                </Button>
              </>
            ) : (
              <Typography variant="body1">Cargando datos...</Typography>
            )}
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
};

export default PatientsReport;
