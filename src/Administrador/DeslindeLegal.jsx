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

const DeslindeLegal = () => {
    const [deslindes, setDeslindes] = useState([]);
    const [numeroDeslinde, setNumeroDeslinde] = useState('');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState('');

    // Estado para errores de validación
    const [errors, setErrors] = useState({
        numeroDeslinde: '',
        titulo: '',
        contenido: ''
    });

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const deslindesPerPage = 3; // Número de deslindes por página

    useEffect(() => {
        fetchDeslindes();
    }, []);

    const fetchDeslindes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/deslinde/getdeslinde');
            setDeslindes(response.data);
        } catch (error) {
            console.error('Error al obtener deslindes:', error);
            setMensaje('Error al cargar deslindes.');
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            numeroDeslinde: '',
            titulo: '',
            contenido: ''
        };

        if (!numeroDeslinde) {
            newErrors.numeroDeslinde = 'El número de deslinde es obligatorio.';
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

        if (!validateForm()) return; // Validar antes de enviar

        const deslindeData = { numero_deslinde: numeroDeslinde, titulo, contenido };

        try {
            if (editingIndex !== null) {
                // Actualizar deslinde
                await axios.put(`http://localhost:3001/api/deslinde/update/${deslindes[editingIndex].id}`, deslindeData);
                setMensaje('Deslinde actualizado con éxito');
            } else {
                // Insertar nuevo deslinde 
                await axios.post('http://localhost:3001/api/deslinde/insert', deslindeData);
                setMensaje('Deslinde insertado con éxito');
            }
            fetchDeslindes(); // Refrescar la lista de deslindes
            resetForm();
        } catch (error) {
            console.error('Error al enviar deslinde:', error);
            setMensaje('Error al enviar deslinde.');
        }
    };

    const resetForm = () => {
        setNumeroDeslinde('');
        setTitulo('');
        setContenido('');
        setEditingIndex(null);
        setErrors({ numeroDeslinde: '', titulo: '', contenido: '' }); // Reiniciar errores
    };

    const handleEdit = (index) => {
        setNumeroDeslinde(deslindes[index].numero_deslinde);
        setTitulo(deslindes[index].titulo);
        setContenido(deslindes[index].contenido);
        setEditingIndex(index);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/deslinde/delete/${id}`);
            setMensaje('Deslinde eliminado con éxito');
            fetchDeslindes(); // Refrescar la lista de deslindes
        } catch (error) {
            console.error('Error al eliminar deslinde:', error);
            setMensaje('Error al eliminar deslinde.');
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
    const indexOfLastDeslinde = currentPage * deslindesPerPage;
    const indexOfFirstDeslinde = indexOfLastDeslinde - deslindesPerPage;
    const currentDeslindes = deslindes.slice(indexOfFirstDeslinde, indexOfLastDeslinde);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(deslindes.length / deslindesPerPage)) {
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
                    Deslinde Legal
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Número de Deslinde"
                        type="number"
                        value={numeroDeslinde}
                        onChange={(e) => setNumeroDeslinde(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '10px' }}
                        error={!!errors.numeroDeslinde} // Mostrar error si existe
                        helperText={errors.numeroDeslinde} // Mensaje de error
                    />
                    <TextField
                        label="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '10px' }}
                        error={!!errors.titulo} // Mostrar error si existe
                        helperText={errors.titulo} // Mensaje de error
                    />
                    <TextField
                        label="Contenido"
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginBottom: '20px' }}
                        error={!!errors.contenido} // Mostrar error si existe
                        helperText={errors.contenido} // Mensaje de error
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

            {/* Tarjeta que encierra los deslindes y paginación */}
            <Paper style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.5)' }}>
            <List style={{ marginTop: '20px' }}>
    {currentDeslindes.map((deslinde, index) => (
        <ListItem key={deslinde.id} style={{ marginBottom: '20px' }}>
            <Paper style={{ padding: '10px', width: '100%', boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2)' }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Paper style={{ padding: '10px' }}>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography variant="body1" style={{ overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'pre-line', marginTop: '5px', maxWidth: '350px' }}>
                                            {`Deslinde ${deslinde.numero_deslinde}:`}
                                        </Typography>
                                        <Typography variant="body1" style={{ overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'pre-line', marginTop: '5px', maxWidth: '360px' }}>
                                            {`Título: ${deslinde.titulo}`}
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
                                    <IconButton title="Ver contenido" aria-label="view" onClick={() => handleDialogOpen(deslinde.contenido)}>
                                        <VisibilityIcon style={{ color: 'blue', marginRight: '10px' }} />
                                    </IconButton>
                                    <IconButton title="Actualizar" aria-label="edit" onClick={() => handleEdit(index)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton title="Eliminar" aria-label="delete" onClick={() => handleDelete(deslinde.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
    {`Última fecha de modificación: ${new Date(deslinde.updated_at).toLocaleDateString()}`}
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
                    <Button variant="contained" color="primary" onClick={handleNextPage} disabled={currentPage >= Math.ceil(deslindes.length / deslindesPerPage)}>
                        Siguiente
                    </Button>
                </div>
            </Paper>

            {/* Diálogo para ver el contenido completo */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Contenido Completo</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" style={{ overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>{dialogContent}</Typography>
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

export default DeslindeLegal;
