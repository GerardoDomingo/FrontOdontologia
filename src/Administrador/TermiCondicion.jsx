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
    Grid
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
            const response = await axios.get('http://localhost:3001/api/termiCondicion/getTerminos');
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
                await axios.put(`http://localhost:3001/api/termiCondicion/update/${terminos[editingIndex].id}`, terminoData);
                setMensaje('Término actualizado con éxito');
            } else {
                await axios.post('http://localhost:3001/api/termiCondicion/insert', terminoData);
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
            await axios.delete(`http://localhost:3001/api/termiCondicion/delete/${id}`);
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
        <div style={{ padding: '60px' }}>
            <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)' }}>
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
                        style={{ marginBottom: '10px' }}
                        error={!!errors.numeroTermino}
                        helperText={errors.numeroTermino}
                    />
                    <TextField
                        label="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '10px' }}
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
                        style={{ marginBottom: '20px' }}
                        error={!!errors.contenido}
                        helperText={errors.contenido}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {editingIndex !== null ? 'Actualizar' : 'Agregar'}
                    </Button>
                </form>
                {mensaje && (
                    <Typography variant="body1" style={{ marginTop: '10px', color: mensaje.includes('Error') ? 'red' : 'green' }}>
                        {mensaje}
                    </Typography>
                )}
            </Paper>

            <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)' }}>
                <List style={{ marginTop: '20px' }}>
                    {currentTerminos.map((termino, index) => (
                        <ListItem key={termino.id} style={{ marginBottom: '20px' }}>
                            <Paper style={{ padding: '10px', width: '100%', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Paper style={{ padding: '10px' }}>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <Typography variant="body1" style={{ overflowWrap: 'break-word', whiteSpace: 'pre-line', marginTop: '5px' }}>
                                                            {`Término ${termino.numero_termino}: ${termino.titulo}`}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper style={{ height: '100%' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Acciones</Typography>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <IconButton title="Ver contenido" aria-label="view" onClick={() => handleDialogOpen(termino.contenido)}>
                                                        <VisibilityIcon style={{ color: 'blue', marginRight: '10px' }} />
                                                    </IconButton>
                                                    <IconButton title="Actualizar" aria-label="edit" onClick={() => handleEdit(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton title="Eliminar" aria-label="delete" onClick={() => handleDelete(termino.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', fontStyle: 'italic', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                       Última modificación: {new Date(termino.fecha_actualizacion).toLocaleString()}
                                </Typography>
                            </Paper>
                        </ListItem>
                    ))}
                </List>
          {/* Controles de paginación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </Button>
                    <Typography variant="body1" style={{ margin: '0 20px' }}>
                        Página {currentPage}
                    </Typography>
                    <Button  variant="contained" color="primary"  onClick={handleNextPage} disabled={currentPage === Math.ceil(terminos.length / terminosPerPage)}>
                        Siguiente
                    </Button>
                </div>
            </Paper>

            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Contenido del Término
                    <IconButton aria-label="close" onClick={handleDialogClose} style={{ position: 'absolute', right: '10px', top: '10px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" style={{ overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                        {dialogContent}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TerminosCondiciones;
