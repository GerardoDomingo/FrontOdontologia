import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
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
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const PoliticasPrivacidad = () => {
    const [politicas, setPoliticas] = useState([]);
    const [numeroPolitica, setNumeroPolitica] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');

    const [errors, setErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const policiesPerPage = 3;

    const [historico, setHistorico] = useState([]); // Para guardar políticas inactivas
    const [page, setPage] = useState(0); // Para paginación del historial

    useEffect(() => {
        fetchPoliticas();
    }, []);

    const fetchPoliticas = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/getpolitica');
            const activePolicies = response.data.filter(politica => politica.estado === 'activo');
            const inactivePolicies = response.data.filter(politica => politica.estado === 'inactivo');
            setPoliticas(activePolicies);
            setHistorico(inactivePolicies);
        } catch (error) {
            console.error('Error al obtener políticas:', error);
            setMensaje('Error al cargar políticas.');
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
        setMensaje('');

        if (!validateForm()) return;

        const politicaData = { numero_politica: numeroPolitica, titulo, contenido };

        try {
            if (editingIndex !== null) {
                const updatedPolitica = {
                    ...politicaData,
                    version: politicas[editingIndex].version + 1 // Aumentamos la versión
                };
                await axios.put(`https://backendodontologia.onrender.com/api/politicas/update/${politicas[editingIndex].id}`, updatedPolitica);
                setMensaje('Política actualizada con éxito');
            } else {
                await axios.post('https://backendodontologia.onrender.com/api/politicas/insert', politicaData);
                setMensaje('Política insertada con éxito');
            }
            fetchPoliticas();
            resetForm();
        } catch (error) {
            console.error('Error al enviar política:', error);
            setMensaje('Error al enviar política.');
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
            setMensaje('Política eliminada (lógicamente) con éxito');
            fetchPoliticas();
        } catch (error) {
            console.error('Error al eliminar política:', error);
            setMensaje('Error al eliminar política.');
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

    return (
        <Box sx={{ padding: '60px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Paper sx={{ padding: '20px', maxWidth: '600px', margin: '20px auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Políticas de Privacidad Vigentes
                </Typography>
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
                {mensaje && (
                    <Typography variant="body1" sx={{ mt: 2, color: mensaje.includes('Error') ? 'red' : 'green' }}>
                        {mensaje}
                    </Typography>
                )}
            </Paper>

            {/* Historial de Políticas  */}
            <Typography variant="h5" align="center" sx={{ mt: 6, mb: 4 }}>
                Historial de Políticas 
            </Typography>
            <TableContainer component={Paper}>
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
        </Box>
    );
};

export default PoliticasPrivacidad;
