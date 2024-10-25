import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Typography, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Box, Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones';

const PoliticasPrivacidad = () => {
    const [politicas, setPoliticas] = useState([]);
    const [numeroPolitica, setNumeroPolitica] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingIndex, setEditingIndex] = useState(null); // Estado para identificar si estamos editando
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(0);
    const policiesPerPage = 3;
    const [historico, setHistorico] = useState([]);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [isAddingNewPolicy, setIsAddingNewPolicy] = useState(false); // Estado para controlar si se está agregando una nueva política

    useEffect(() => {
        fetchPoliticas();
    }, []);

    const fetchPoliticas = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/getAllPoliticas');
            const activePolicies = response.data.filter(politica => politica.estado === 'activo');
            const inactivePolicies = response.data.filter(politica => politica.estado === 'inactivo');
            setPoliticas(activePolicies);
            setHistorico(inactivePolicies);
        } catch (error) {
            setNotification({ open: true, message: 'Error al cargar políticas.', type: 'error' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!numeroPolitica) newErrors.numeroPolitica = "El número de política es obligatorio.";
        if (!titulo) newErrors.titulo = "El título es obligatorio.";
        if (!contenido) newErrors.contenido = "El contenido es obligatorio.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        const politicaData = { numero_politica: numeroPolitica, titulo, contenido };
    
        try {
            if (editingIndex !== null) {
                // Si estamos en modo de edición, usamos el endpoint de actualización
                const oldPolitica = politicas[editingIndex];
                
                // Actualizar la política existente usando el endpoint de actualización
                await axios.put(`https://backendodontologia.onrender.com/api/politicas/update/${oldPolitica.id}`, politicaData);
    
                setNotification({ open: true, message: `Política actualizada correctamente`, type: 'success' });
            } else {
                // Si no estamos editando, es una nueva política. Insertamos.
                if (politicas.length > 0) {
                    await axios.put(`https://backendodontologia.onrender.com/api/politicas/deactivate/${politicas[0].id}`, { estado: 'inactivo' });
                }
    
                // Insertar la nueva política con versión 1 (esto también lo maneja el backend si es necesario)
                await axios.post('https://backendodontologia.onrender.com/api/politicas/insert', politicaData);
    
                setNotification({ open: true, message: 'Política insertada con éxito', type: 'success' });
            }
    
            fetchPoliticas();
            resetForm();
            setIsAddingNewPolicy(false); // Reactivar el botón "Nueva Política"
        } catch (error) {
            setNotification({ open: true, message: 'Error al enviar política', type: 'error' });
        }
    };
    
    
    const resetForm = () => {
        setNumeroPolitica('');
        setTitulo('');
        setContenido('');
        setEditingIndex(null); // Reseteamos el índice de edición
        setErrors({});
        setIsAddingNewPolicy(false); // Reactivar el botón "Nueva Política"
    };

    const handleEdit = (index) => {
        setNumeroPolitica(politicas[index].numero_politica);
        setTitulo(politicas[index].titulo);
        setContenido(politicas[index].contenido);
        setEditingIndex(index); // Guardamos el índice de la política que se está editando
        setIsAddingNewPolicy(true); // Abrimos el formulario de nueva política para editar
    };

    const handleDelete = async (id) => {
        try {
            await axios.put(`https://backendodontologia.onrender.com/api/politicas/deactivate/${id}`, { estado: 'inactivo' });
            setNotification({ open: true, message: 'Política eliminada con éxito', type: 'success' });
            fetchPoliticas();
        } catch (error) {
            setNotification({ open: true, message: 'Error al eliminar política', type: 'error' });
        }
    };

    const handleDialogOpen = (politica) => {
        setDialogContent(politica); // Guardamos todo el objeto de la política en lugar de solo el contenido
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const truncateContent = (content) => {
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    return (
        <Box sx={{ padding: '40px', backgroundColor: '#f9fafc', minHeight: '100vh' }}>
            {/* Política de Privacidad Vigente */}
            <Paper sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Política de Privacidad Vigente
                </Typography>
                {politicas.length > 0 && (
                    <Paper sx={{ padding: '20px', mt: 4, backgroundColor: '#e3f2fd' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="h5">Vigente: {politicas[0].titulo}</Typography>
                                <Typography variant="body2" color="textSecondary">Número: {politicas[0].numero_politica}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                                <IconButton onClick={() => handleEdit(0)}><EditIcon sx={{ color: '#1976d2' }} /></IconButton>
                                <IconButton onClick={() => handleDelete(politicas[0].id)}><DeleteIcon sx={{ color: 'red' }} /></IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    {truncateContent(politicas[0].contenido)}{' '}
                                    <Button variant="outlined" onClick={() => handleDialogOpen(politicas[0])}>Ver más</Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* Botón Nueva Política */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: 3 }}
                    onClick={() => setIsAddingNewPolicy(true)}
                    disabled={isAddingNewPolicy} // Deshabilitar botón cuando está activo
                >
                    Nueva Política
                </Button>

                {/* Formulario para agregar o actualizar políticas */}
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
                            label="Número de Política"
                            type="number"
                            value={numeroPolitica}
                            onChange={(e) => setNumeroPolitica(e.target.value)}
                            fullWidth
                            sx={{ mt: 2 }}
                            error={!!errors.numeroPolitica}
                            helperText={errors.numeroPolitica}
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
                                    {editingIndex !== null ? 'Actualizar' : 'Agregar'}
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

            {/* Historial de Políticas */}
            <Typography variant="h5" align="center" sx={{ mt: 6, mb: 4 }}>
                Historial de Políticas
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: '800px', margin: '0 auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número de Política</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Versión</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha de Creación</TableCell>
                            <TableCell>Fecha de Actualización</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historico.slice(page * policiesPerPage, (page + 1) * policiesPerPage).map((politica, index) => (
                            <TableRow key={index}>
                                <TableCell>{politica.numero_politica}</TableCell>
                                <TableCell>{politica.titulo}</TableCell>
                                <TableCell>{politica.version}</TableCell> {/* Mostrar versión */}
                                <TableCell>{politica.estado}</TableCell> {/* Mostrar estado */}
                                <TableCell>{new Date(politica.fecha_creacion).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(politica.fecha_actualizacion).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={historico.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={policiesPerPage}
                    rowsPerPageOptions={[]}
                />
            </TableContainer>


            {/* Diálogo para visualizar el contenido completo de la política */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Detalles de la Política de Privacidad</DialogTitle>
                <DialogContent>
                    {/* Título de la política */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Título: {dialogContent?.titulo}
                    </Typography>

                    {/* Número de la política */}
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Número de Política: {dialogContent?.numero_politica}
                    </Typography>

                    {/* Contenido de la política */}
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

export default PoliticasPrivacidad;
