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

const PoliticasPrivacidad = () => {
    const [politicas, setPoliticas] = useState([]);
    const [numeroPolitica, setNumeroPolitica] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    
    // Estado para errores
    const [errors, setErrors] = useState({});

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const policiesPerPage = 3; // Número de políticas por página

    useEffect(() => {
        fetchPoliticas();
    }, []);

    const fetchPoliticas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/politicas/getpolitica');
            setPoliticas(response.data);
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
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        // Validar el formulario antes de enviar
        if (!validateForm()) return;

        const politicaData = { numero_politica: numeroPolitica, titulo, contenido };

        try {
            if (editingIndex !== null) {
                // Actualizar política
                await axios.put(`http://localhost:3001/api/politicas/update/${politicas[editingIndex].id}`, politicaData);
                setMensaje('Política actualizada con éxito');
            } else {
                // Insertar nueva política
                await axios.post('http://localhost:3001/api/politicas/insert', politicaData);
                setMensaje('Política insertada con éxito');
            }
            fetchPoliticas(); // Refrescar la lista de políticas
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
        setErrors({}); // Reiniciar los errores al resetear el formulario
    };

    const handleEdit = (index) => {
        setNumeroPolitica(politicas[index].numero_politica);
        setTitulo(politicas[index].titulo);
        setContenido(politicas[index].contenido);
        setEditingIndex(index);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/politicas/delete/${id}`);
            setMensaje('Política eliminada con éxito');
            fetchPoliticas(); // Refrescar la lista de políticas
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

    // Funciones de paginación
    const indexOfLastPolicy = currentPage * policiesPerPage;
    const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
    const currentPolicies = politicas.slice(indexOfFirstPolicy, indexOfLastPolicy);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(politicas.length / policiesPerPage)) {
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
                    Políticas de Privacidad
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Número de Política"
                        type="number"
                        value={numeroPolitica}
                        onChange={(e) => setNumeroPolitica(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '10px' }}
                        error={!!errors.numeroPolitica}
                        helperText={errors.numeroPolitica}
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

            {/* Tarjeta que encierra las políticas y paginación */}
            <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)' }}>
                <List style={{ marginTop: '20px' }}>
                    {currentPolicies.map((politica, index) => (
                        <ListItem key={politica.id} style={{ marginBottom: '20px' }}>
                            <Paper style={{ padding: '10px', width: '100%', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' }}>
                                {/* Contenedor para Título y Política con diseño de cuadrícula */}
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Paper style={{ padding: '10px' }}>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <Typography
                                                            variant="body1"
                                                            style={{
                                                                overflowWrap: 'break-word',
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'pre-line',
                                                                marginTop: '5px',
                                                                maxWidth: '350px',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {`Política ${politica.numero_politica}:`}
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            style={{
                                                                overflowWrap: 'break-word',
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'pre-line',
                                                                marginTop: '5px',
                                                                maxWidth: '360px',
                                                            }}
                                                        >
                                                            {`Título: ${politica.titulo}`}
                                                        </Typography>
                                                    </>
                                                }
                                            secondary={
                                                <Typography variant="body2" color="textSecondary">
                                                    {`Última actualización: ${new Date(politica.fecha_actualizacion).toLocaleDateString()}`}
                                                </Typography>
                                            }
                                        />
                                            
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper style={{ height: '100%' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Acciones</Typography>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <IconButton title="Ver contenido" aria-label="view" onClick={() => handleDialogOpen(politica.contenido)}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton title="Editar" aria-label="edit" onClick={() => handleEdit(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton title="Eliminar" aria-label="delete" onClick={() => handleDelete(politica.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </ListItem>
                    ))}
                </List>
                     {/* Controles de paginación */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
    <Button 
        variant="contained" 
        color="primary" 
        onClick={handlePreviousPage} 
        disabled={currentPage === 1}
    >
        Anterior
    </Button>
    <Typography variant="body1" style={{ margin: '0 20px' }}>
        Página {currentPage} de {Math.ceil(politicas.length / policiesPerPage)}
    </Typography>
    <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNextPage} 
        disabled={currentPage >= Math.ceil(politicas.length / policiesPerPage)}>
            Siguiente</Button>
        </div>
            </Paper>

            {/* Diálogo para visualizar el contenido de la política */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Contenido de la Política</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" style={{ overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                            {dialogContent}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary" startIcon={<CloseIcon />}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

        </div>
    );
};

export default PoliticasPrivacidad;