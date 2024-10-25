import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones';

const PoliticasPrivacidad = () => {
    const [politicas, setPoliticas] = useState([]);
    const [numeroPolitica, setNumeroPolitica] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const policiesPerPage = 3;
    const [historico, setHistorico] = useState([]);
    const [page, setPage] = useState(0);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });

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
            console.error('Error al obtener políticas:', error);
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
                const updatedPolitica = {
                    ...politicaData,
                    version: politicas[editingIndex].version + 1 
                };
                await axios.put(`https://backendodontologia.onrender.com/api/politicas/update/${politicas[editingIndex].id}`, updatedPolitica);
                setNotification({ open: true, message: 'Política actualizada con éxito', type: 'success' });
            } else {
                await axios.post('https://backendodontologia.onrender.com/api/politicas/insert', politicaData);
                setNotification({ open: true, message: 'Política insertada con éxito', type: 'success' });
            }
            fetchPoliticas();
            resetForm();
        } catch (error) {
            console.error('Error al enviar política:', error);
            setNotification({ open: true, message: 'Error al enviar política', type: 'error' });
        }
    };

    const resetForm = () => {
        setNumeroPolitica('');
        setTitulo('');
        setContenido('');
        setEditingIndex(null);
        setErrors({});
    };

    const handleEdit = (index) => {
        setNumeroPolitica(politicas[index].numero_politica);
        setTitulo(politicas[index].titulo);
        setContenido(politicas[index].contenido);
        setEditingIndex(index);
    };

    const handleDelete = async (id) => {
        try {
            await axios.put(`https://backendodontologia.onrender.com/api/politicas/deactivate/${id}`, { estado: 'inactivo' });
            setNotification({ open: true, message: 'Política eliminada (lógicamente) con éxito', type: 'success' });
            fetchPoliticas();
        } catch (error) {
            console.error('Error al eliminar política:', error);
            setNotification({ open: true, message: 'Error al eliminar política', type: 'error' });
        }
    };

    const handleDialogOpen = (contenido) => {
        setDialogContent(contenido);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Función para truncar contenido largo
    const truncateContent = (content) => {
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    return (
        <Box sx={{ padding: '40px', backgroundColor: '#f9fafc', minHeight: '100vh' }}>
            {/* Política de Privacidad Vigente */}
            <Paper sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)', position: 'relative' }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Política de Privacidad Vigente
                </Typography>
                {politicas.length > 0 && (
                    <Paper sx={{ padding: '20px', mt: 4, backgroundColor: '#e3f2fd', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Título: {politicas[0].titulo}</Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>Número: {politicas[0].numero_politica}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {truncateContent(politicas[0].contenido)}{' '}
                            <IconButton aria-label="ver más" onClick={() => handleDialogOpen(politicas[0].contenido)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Typography>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton title="Editar" aria-label="edit" onClick={() => handleEdit(0)}>
                                <EditIcon sx={{ color: '#1976d2' }} />
                            </IconButton>
                            <IconButton title="Eliminar" aria-label="delete" onClick={() => handleDelete(politicas[0].id)}>
                                <DeleteIcon sx={{ color: 'red' }} />
                            </IconButton>
                        </Box>
                    </Paper>
                )}

                {/* Botón Nuevo */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ position: 'absolute', top: 20, right: 20 }}
                    onClick={() => resetForm()}
                >
                    Nueva Política
                </Button>

                {/* Formulario para agregar/actualizar políticas */}
                {editingIndex === null && (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Número de Política"
                            type="number"
                            value={numeroPolitica}
                            onChange={(e) => setNumeroPolitica(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                            error={!!errors.numeroPolitica}
                            helperText={errors.numeroPolitica}
                        />
                        <TextField
                            label="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
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
                            sx={{ mb: 3 }}
                            error={!!errors.contenido}
                            helperText={errors.contenido}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            {editingIndex !== null ? 'Actualizar' : 'Agregar'}
                        </Button>
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
                            <TableCell>Fecha de Creación</TableCell>
                            <TableCell>Fecha de Actualización</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historico.slice(page * policiesPerPage, (page + 1) * policiesPerPage).map((politica, index) => (
                            <TableRow key={index}>
                                <TableCell>{politica.numero_politica}</TableCell>
                                <TableCell>{politica.titulo}</TableCell>
                                <TableCell>{politica.version}</TableCell>
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

            {/* Diálogo para visualizar el contenido de la política */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Contenido de la Política</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                        {dialogContent}
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
