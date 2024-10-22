import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const LogsReport = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamar al endpoint para obtener los datos de logs
    fetch('/api/reportes/logs')
      .then((response) => response.json())
      .then((data) => setLogs(data))
      .catch((err) => {
        setError('Error al cargar los datos');
        console.error(err);
      });
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Reporte de Logs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
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
                <TableCell>{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LogsReport;
