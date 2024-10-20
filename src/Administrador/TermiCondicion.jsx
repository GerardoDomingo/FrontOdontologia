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
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const TerminosCondiciones = () => {
    const [terminos, setTerminos] = useState([]);
    const [numeroTermino, setNumeroTermino] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');

    const [errors, setErrors] = useState({
        numeroTermino: '',
        titulo: '',
        contenido: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const terminosPerPage = 3;

    useEffect(() => {
        fetchTerminos();
    }, []);

    const fetchTerminos = async () => {
        try {
            const response = await axios.get('https://backendodontologia.onrender.com/api/termiCondicion/getterminos');
            setTerminos(response.data);
        } catch (error) {
            console.error('Error al obtener términos:', error);
            setMensaje('Error al cargar términos.');
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            numeroTermino: '',
            titulo: '',
            contenido: ''
        };

        if (!numeroTermino) {
            newErrors.numeroTermino = 'El número de término es obligatorio.';
            valid = false;
        }
        if (!titulo) {
            newErrors.titulo = 'El título es obligatorio.';
            valid = false;
        }
        if (!contenido) {
            newErrors.contenido = 'El contenido es obligatorio.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        if (!validateForm()) return;

        const terminoData = { numero_termino: numeroTermino, titulo, contenido };

        try {
            if (editingIndex !== null) {
                await axios.put(`https://backendodontologia.onrender.com/api/termiCondicion/update/${terminos[editingIndex].id}`, terminoData);
                setMensaje('Término actualizado con éxito');
            } else {
                await axios.post('https://backendodontologia.onrender.com/api/termiCondicion/insert', terminoData);
                setMensaje('Término insertado con éxito');
            }
            fetchTerminos();
            resetForm();
        } catch (error) {
            console.error('Error al enviar término:', error);
            setMensaje('Error al enviar término.');
        }
    };

    const resetForm = () => {
        setNumeroTermino('');
        setTitulo('');
        setContenido('');
        setEditingIndex(null);
        setErrors({ numeroTermino: '', titulo: '', contenido: '' });
    };

    const handleEdit = (index) => {
        setNumeroTermino(terminos[index].numero_termino);
        setTitulo(terminos[index].titulo);
        setContenido(terminos[index].contenido);
        setEditingIndex(index);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://backendodontologia.onrender.com/api/termiCondicion/delete/${id}`);
            setMensaje('Término eliminado con éxito');
            fetchTerminos();
        } catch (error) {
            console.error('Error al eliminar término:', error);
            setMensaje('Error al eliminar término.');
        }
    };

    const handleDialogOpen = (contenido) => {
        setDialogContent(contenido);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const indexOfLastTermino = currentPage * terminosPerPage;
    const indexOfFirstTermino = indexOfLastTermino - terminosPerPage;
    const currentTerminos = terminos.slice(indexOfFirstTermino, indexOfLastTermino);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(terminos.length / terminosPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Box sx={{ padding: '60px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Paper sx={{ padding: '30px', maxWidth: '650px', margin: '20px auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Términos y Condiciones
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Número de Término"
                        type="number"
                        value={numeroTermino}
                        onChange={(e) => setNumeroTermino(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        error={!!errors.numeroTermino}
                        helperText={errors.numeroTermino}
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

            {/* Tarjeta que encierra las políticas y paginación */}
            {terminos.length > 0 ? (
                <Paper sx={{ padding: '20px', maxWidth: '650px', margin: '20px auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                    <List sx={{ mt: 3 }}>
                        {currentTerminos.map((termino, index) => (
                            <ListItem key={termino.id} sx={{ mb: 2 }}>
                                <Paper sx={{ padding: '10px', width: '100%', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <ListItemText
                                                primary={`Término ${termino.numero_termino}:`}
                                                secondary={`Título: ${termino.titulo}`}
                                                sx={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                                            />
                                            <Typography variant="body2" color="textSecondary">
                                                {`Última actualización: ${new Date(termino.fecha_actualizacion).toLocaleDateString()}`}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    Acciones
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
                                                    <IconButton title="Ver contenido" aria-label="view" onClick={() => handleDialogOpen(termino.contenido)}>
                                                        <VisibilityIcon sx={{ color: 'blue' }} />
                                                    </IconButton>
                                                    <IconButton title="Editar" aria-label="edit" onClick={() => handleEdit(index)}>
                                                        <EditIcon sx={{ color: '#1976d2' }} />
                                                    </IconButton>
                                                    <IconButton title="Eliminar" aria-label="delete" onClick={() => handleDelete(termino.id)}>
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </ListItem>
                        ))}
                    </List>

                    {/* Controles de paginación */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Anterior
                        </Button>
                        <Typography variant="body1" sx={{ mx: 2 }}>
                            Página {currentPage} de {Math.ceil(terminos.length / terminosPerPage)}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleNextPage} disabled={currentPage >= Math.ceil(terminos.length / terminosPerPage)}>
                            Siguiente
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                    No hay términos disponibles.
                </Typography>
            )}

            {/* Diálogo para visualizar el contenido de la política */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Contenido del Término</DialogTitle>
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

export default TerminosCondiciones;
