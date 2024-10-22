import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const LoginAttemptsReport = () => {
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [error, setError] = useState(null);

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
        setLoginAttempts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLoginAttempts();
  }, []);

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
                <TableCell>{attempt.paciente_id}</TableCell>
                <TableCell>{attempt.fecha_hora}</TableCell>
                <TableCell>{attempt.intentos_fallidos}</TableCell>
                <TableCell>{attempt.fecha_bloqueo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoginAttemptsReport;
