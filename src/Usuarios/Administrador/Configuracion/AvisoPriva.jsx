import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Typography, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Notificaciones from '../../Compartidos/Notificaciones';

const PoliticasPrivacidad = () => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [errors, setErrors] = useState({});
    const [politicas, setPoliticas] = useState([]);
    const [politicaActiva, setPoliticaActiva] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [isAddingNewPolicy, setIsAddingNewPolicy] = useState(false);

    useEffect(() => {
        fetchPoliticas();
        fetchPoliticaActiva();
    }, []);

    const fetchPoliticas = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/getAllPoliticas');
            const data = response.data;

            const politicasInactivas = data.filter(politica => politica.estado === 'inactivo');
            politicasInactivas.sort((a, b) => parseFloat(b.version) - parseFloat(a.version));

            setPoliticas(politicasInactivas);
        } catch (error) {
            console.error('Error al cargar políticas:', error);
        }
    };

    const fetchPoliticaActiva = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/getpolitica');
            if (response.data) {
                setPoliticaActiva(response.data);
            } else {
                setPoliticaActiva(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setPoliticaActiva(null);
                console.error('No hay políticas activas.');
            } else {
                console.error('Error al cargar política activa:', error);
                setPoliticaActiva(null);
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!titulo) newErrors.titulo = "El título es obligatorio.";
        if (!contenido) newErrors.contenido = "El contenido es obligatorio.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Agregar política con número predeterminado y estado inactivo
        const politicaData = { numero_politica: 0, titulo, contenido, estado: 'inactivo' };

        try {
            if (editingId !== null) {
                await axios.put(`https://backendodontologia.onrender.com/api/politicas/update/${editingId}`, politicaData);
                setNotification({ open: true, message: `Política actualizada correctamente`, type: 'success' });
            } else {
                await axios.post('https://backendodontologia.onrender.com/api/politicas/insert', politicaData);
                setNotification({ open: true, message: 'Política insertada con éxito', type: 'success' });
            }

            await fetchPoliticas();
            await fetchPoliticaActiva();
            resetForm();
            setIsAddingNewPolicy(false);
        } catch (error) {
            setNotification({ open: true, message: 'Error al enviar política', type: 'error' });
        }
    };

    const resetForm = () => {
        setTitulo('');
        setContenido('');
        setEditingId(null);
        setErrors({});
        setIsAddingNewPolicy(false);
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`https://backendodontologia.onrender.com/api/politicas/get/${id}`);
            const politica = response.data;

            if (politica) {
                setTitulo(politica.titulo);
                setContenido(politica.contenido);
                setEditingId(id);
                setIsAddingNewPolicy(true);
            }
        } catch (error) {
            console.error("Error al cargar la política para editar:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.put(`https://backendodontologia.onrender.com/api/politicas/deactivate/${id}`, { estado: 'inactivo' });
            setNotification({ open: true, message: 'Política eliminada con éxito', type: 'success' });
            await fetchPoliticas();
            await fetchPoliticaActiva();
        } catch (error) {
            setNotification({ open: true, message: 'Error al eliminar política', type: 'error' });
        }
    };

    const handleDialogOpen = (politica) => {
        setDialogContent(politica);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const truncateContent = (content) => {
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    return (
        <Box sx={{ padding: '40px', backgroundColor: '#f9fafc', minHeight: '100vh' }}>
            <Paper sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Política de Privacidad
                </Typography>
                {politicaActiva && (
                    <Paper sx={{ padding: '20px', mt: 4, backgroundColor: '#e3f2fd' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="h5">Vigente: {politicaActiva.titulo}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Versión: {politicaActiva.version}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                                <IconButton onClick={() => handleEdit(politicaActiva.id)}><EditIcon sx={{ color: '#1976d2' }} /></IconButton>
                                <IconButton onClick={() => handleDelete(politicaActiva.id)}><DeleteIcon sx={{ color: 'red' }} /></IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    {truncateContent(politicaActiva.contenido)}{' '}
                                    <Button variant="outlined" onClick={() => handleDialogOpen(politicaActiva)}>Ver más</Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: 3 }}
                    onClick={() => {
                        resetForm();
                        setIsAddingNewPolicy(true);
                    }}
                    disabled={isAddingNewPolicy}
                >
                    Nueva Política
                </Button>

                {isAddingNewPolicy && (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            fullWidth
                            sx={{ mt: 3 }}
                            error={!!errors.titulo}
                            helperText={errors.titulo}
                        />
                        <TextField
                            label="Contenido"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mt: 2 }}
                            error={!!errors.contenido}
                            helperText={errors.contenido}
                        />
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid item xs={6}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    {editingId !== null ? 'Actualizar' : 'Agregar'}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={resetForm}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Paper>

            <Typography variant="h5" align="center" sx={{ mt: 6, mb: 4 }}>
                Historial de Políticas por Versión
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><Typography fontWeight="bold">Título</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Versión</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Estado</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Fecha de Creación</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Fecha de Actualización</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {politicas.length > 0 ? (
                            politicas.map((politica, index) => (
                                <TableRow key={index}>
                                    <TableCell>{politica.titulo}</TableCell>
                                    <TableCell>{politica.version}</TableCell>
                                    <TableCell>{politica.estado}</TableCell>
                                    <TableCell>{new Date(politica.fecha_creacion).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(politica.fecha_actualizacion).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay políticas inactivas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Detalles de la Política de Privacidad</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Título: {dialogContent?.titulo}
                    </Typography>
                    <Typography variant="body1" sx={{ overflowWrap: 'break-word', whiteSpace: 'pre-line', mb: 3 }}>
                        {dialogContent?.contenido}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Fecha de Creación: {new Date(dialogContent?.fecha_creacion).toLocaleDateString()}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" startIcon={<CloseIcon />}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Notificaciones
                open={notification.open}
                message={notification.message}
                type={notification.type}
                handleClose={() => setNotification({ ...notification, open: false })}
            />
        </Box>
    );
};

export default PoliticasPrivacidad;
