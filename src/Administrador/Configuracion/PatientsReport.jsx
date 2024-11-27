import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  IconButton,
  Paper,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaVenusMars, FaMapMarkerAlt, FaSyringe, FaUserCheck } from 'react-icons/fa';
import axios from 'axios';

const PatientsReport = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/reportes/pacientes');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setModalOpen(false);
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 30%, #f9f9f9 100%)',
      }}
    >
      {/* Título */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#1976d2',
          textAlign: 'center',
        }}
      >
        Lista de Pacientes
      </Typography>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Más Información</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`${patient.nombre} ${patient.aPaterno} ${patient.aMaterno}`}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.telefono}</TableCell>
                <TableCell>{patient.estado}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(patient)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedPatient && (
            <>
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#1976d2' }}
              >
                Información Detallada del Paciente
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaUser style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedPatient.nombre} {selectedPatient.aPaterno} {selectedPatient.aMaterno}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaCalendarAlt style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">{formatDate(selectedPatient.fechaNacimiento)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaPhone style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">{selectedPatient.telefono}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaEnvelope style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">{selectedPatient.email}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaVenusMars style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">{selectedPatient.genero}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaMapMarkerAlt style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">{selectedPatient.lugar}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaSyringe style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">
                  {selectedPatient.alergias && selectedPatient.alergias.length > 0
                    ? selectedPatient.alergias
                    : 'Ninguna alergia'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FaUserCheck style={{ marginRight: 8, color: '#1976d2' }} />
                <Typography variant="body1">{selectedPatient.estado}</Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleCloseModal}
              >
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default PatientsReport;
