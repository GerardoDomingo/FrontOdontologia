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

const DeslindeLegal = () => {
    const [numeroDeslinde, setNumeroDeslinde] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [errors, setErrors] = useState({});
    const [deslindes, setDeslindes] = useState([]);
    const [deslindeActivo, setDeslindeActivo] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [isAddingNewDeslinde, setIsAddingNewDeslinde] = useState(false);

    useEffect(() => {
        fetchDeslindes();
        fetchDeslindeActivo(); // Cargar deslinde activo
    }, []);

    // Función para obtener todos los deslindes inactivos
    const fetchDeslindes = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/deslinde/getAllDeslindes');
            const data = response.data;

            // Filtrar deslindes inactivos
            const deslindesInactivos = data.filter(deslinde => deslinde.estado === 'inactivo');

            // Ordenar por versión en orden descendente (de mayor a menor)
            deslindesInactivos.sort((a, b) => parseFloat(b.version) - parseFloat(a.version));

            // Establecer los deslindes ordenados en el estado
            setDeslindes(deslindesInactivos);
        } catch (error) {
            console.error('Error al cargar deslindes:', error);
        }
    };


    const fetchDeslindeActivo = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/deslinde/getdeslinde');
            if (response.data) {
                setDeslindeActivo(response.data); // Guardar el deslinde activo
            } else {
                setDeslindeActivo(null); // En caso de que no haya un deslinde activo
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDeslindeActivo(null); // Establecer deslinde activo a null si no existe
                console.error('No hay deslindes activos.');
            } else {
                console.error('Error al cargar deslinde activo:', error);
                setDeslindeActivo(null);
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!numeroDeslinde) newErrors.numeroDeslinde = "El número de deslinde es obligatorio.";
        if (!titulo) newErrors.titulo = "El título es obligatorio.";
        if (!contenido) newErrors.contenido = "El contenido es obligatorio.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const deslindeData = { numero_deslinde: numeroDeslinde, titulo, contenido };

        try {
            if (editingId !== null) {
                // Actualización de un deslinde existente
                await axios.put(`https://backendodontologia.onrender.com/api/deslinde/update/${editingId}`, deslindeData);
                setNotification({ open: true, message: `Deslinde actualizado correctamente`, type: 'success' });
            } else {
                // Creación de un nuevo deslinde
                await axios.post('https://backendodontologia.onrender.com/api/deslinde/insert', deslindeData);
                setNotification({ open: true, message: 'Deslinde insertado con éxito', type: 'success' });
            }

            // Actualizar los deslindes y el activo después de la operación
            await fetchDeslindes(); // Actualizar la lista de deslindes inactivos
            await fetchDeslindeActivo(); // Actualizar el deslinde activo
            resetForm();
            setIsAddingNewDeslinde(false);
        } catch (error) {
            setNotification({ open: true, message: 'Error al enviar deslinde', type: 'error' });
        }
    };

    const resetForm = () => {
        setNumeroDeslinde('');
        setTitulo('');
        setContenido('');
        setEditingId(null); // Reseteamos el ID de edición
        setErrors({});
        setIsAddingNewDeslinde(false); // Reactivar el botón "Nuevo Deslinde"
    };

    const handleEdit = async (id) => {
        try {
            // Cargar el deslinde activo directamente para edición
            const response = await axios.get(`https://backendodontologia.onrender.com/api/deslinde/get/${id}`);
            const deslinde = response.data;

            if (deslinde) {
                setNumeroDeslinde(deslinde.numero_deslinde);
                setTitulo(deslinde.titulo);
                setContenido(deslinde.contenido);
                setEditingId(id); // Guarda correctamente el ID del deslinde a editar
                setIsAddingNewDeslinde(true); // Abrir el formulario para editar
            }
        } catch (error) {
            console.error("Error al cargar el deslinde para editar:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.put(`https://backendodontologia.onrender.com/api/deslinde/deactivate/${id}`, { estado: 'inactivo' });
            setNotification({ open: true, message: 'Deslinde eliminado con éxito', type: 'success' });
            await fetchDeslindes();
            await fetchDeslindeActivo(); // Refresca el deslinde activo tras eliminar
        } catch (error) {
            setNotification({ open: true, message: 'Error al eliminar deslinde', type: 'error' });
        }
    };

    const handleDialogOpen = (deslinde) => {
        setDialogContent(deslinde); // Guardamos todo el objeto del deslinde en lugar de solo el contenido
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
            {/* Deslinde Vigente */}
            <Paper sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Deslinde
                </Typography>
                {deslindeActivo && (
                    <Paper sx={{ padding: '20px', mt: 4, backgroundColor: '#e3f2fd' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="h5">Vigente: {deslindeActivo.titulo}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Número: {deslindeActivo.numero_deslinde}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Versión: {deslindeActivo.version}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                                <IconButton onClick={() => handleEdit(deslindeActivo.id)}><EditIcon sx={{ color: '#1976d2' }} /></IconButton>
                                <IconButton onClick={() => handleDelete(deslindeActivo.id)}><DeleteIcon sx={{ color: 'red' }} /></IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    {truncateContent(deslindeActivo.contenido)}{' '}
                                    <Button variant="outlined" onClick={() => handleDialogOpen(deslindeActivo)}>Ver más</Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                )}
                {/* Botón Nuevo Deslinde */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: 3 }}
                    onClick={() => {
                        resetForm(); // Reiniciar el formulario para nuevo deslinde
                        setIsAddingNewDeslinde(true);
                    }}
                    disabled={isAddingNewDeslinde} // Deshabilitar botón cuando está activo
                >
                    Nuevo Deslinde
                </Button>

                {/* Formulario para agregar o actualizar deslindes */}
                {isAddingNewDeslinde && (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Número de Deslinde"
                            value={numeroDeslinde}
                            onChange={(e) => setNumeroDeslinde(e.target.value)}
                            fullWidth
                            sx={{ mt: 3 }}
                            error={!!errors.numeroDeslinde}
                            helperText={errors.numeroDeslinde}
                        />
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

            {/* Historial de Deslindes */}
            <Typography variant="h5" align="center" sx={{ mt: 6, mb: 4 }}>
                Historial de Deslindes por Versión
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><Typography fontWeight="bold">Número de Deslinde</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Título</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Versión</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Fecha de Creación</Typography></TableCell>
                            <TableCell><Typography fontWeight="bold">Fecha de Actualización</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deslindes.length > 0 ? (
                            deslindes.map((deslinde, index) => (
                                <TableRow key={index}>
                                    <TableCell>{deslinde.numero_deslinde}</TableCell>
                                    <TableCell>{deslinde.titulo}</TableCell>
                                    <TableCell>{deslinde.version}</TableCell>
                                    <TableCell>{new Date(deslinde.fecha_creacion).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(deslinde.fecha_actualizacion).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No hay deslindes inactivos.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo para visualizar el contenido completo del deslinde */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Detalles del Deslinde</DialogTitle>
                <DialogContent>
                    {/* Título del deslinde */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Título: {dialogContent?.titulo}
                    </Typography>

                    {/* Número del deslinde */}
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Número de Deslinde: {dialogContent?.numero_deslinde}
                    </Typography>

                    {/* Contenido del deslinde */}
                    <Typography variant="body1" sx={{ overflowWrap: 'break-word', whiteSpace: 'pre-line', mb: 3 }}>
                        {dialogContent?.contenido}
                    </Typography>

                    {/* Fecha de creación o de vigencia */}
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

            {/* Componente de Notificaciones */}
            <Notificaciones
                open={notification.open}
                message={notification.message}
                type={notification.type}
                handleClose={() => setNotification({ ...notification, open: false })}
            />
        </Box>
    );
};

export default DeslindeLegal;