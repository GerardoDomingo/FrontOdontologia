import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { format } from 'date-fns';

const LogsReport = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://backendodontologia.onrender.com/api/reportes/logs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los logs');
        }

        const data = await response.json();
        // Ordenar los logs para mostrar los más recientes primero
        const sortedLogs = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sortedLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    fetchLogs();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Historial del Sistema</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nivel</TableCell>
                  <TableCell>Mensaje</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.level}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default LogsReport;
