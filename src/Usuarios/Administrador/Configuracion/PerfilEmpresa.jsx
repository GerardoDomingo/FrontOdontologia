import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
    Box,
    Avatar,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Modal
} from '@mui/material';
import { Save as SaveIcon, Edit as EditIcon, Close as CloseIcon, PhotoCamera as PhotoCameraIcon, ZoomIn as ZoomInIcon } from '@mui/icons-material';
import axios from 'axios';
import Notificaciones from '../../../Compartidos/Notificaciones';
import { Link } from 'react-router-dom';
import RedesSociales from './RedesSociales';

const PerfilEmpresa = () => {
    const [formData, setFormData] = useState({
        id_empresa: '',
        nombre_empresa: '',
        direccion: '',
        telefono: '',
        correo_electronico: '',
        descripcion: '',
        logo: null,
        slogan: ''
    });
    const [logoPreview, setLogoPreview] = useState('');
    const [originalLogo, setOriginalLogo] = useState(''); // Para guardar el logo original
    const [isEditingDatos, setIsEditingDatos] = useState(false);
    const [isEditingLogo, setIsEditingLogo] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [logoChanged, setLogoChanged] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [dataFetched, setDataFetched] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success',
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false); // Para controlar el modal de la imagen

    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            try {
                const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/get');
                const { id_empresa, nombre_empresa, direccion, telefono, correo_electronico, descripcion, logo, slogan } = response.data;

                if (id_empresa) {
                    setFormData({
                        id_empresa,
                        nombre_empresa,
                        direccion,
                        telefono,
                        correo_electronico,
                        descripcion,
                        slogan
                    });
                    setDataFetched(true);
                } else {
                    setDataFetched(false);
                    mostrarNotificacion('No hay información para actualizar, suba su información', 'error');
                }

                if (logo) {
                    const logoBase64 = `data:image/png;base64,${logo}`;
                    setLogoPreview(logoBase64);
                    setOriginalLogo(logoBase64); // Guardamos el logo original
                }
            } catch (error) {
                mostrarNotificacion('Error al obtener el perfil de la empresa', 'error');
            }
        };

        fetchPerfilEmpresa();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setHasChanges(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (allowedTypes.includes(file.type)) {
                setFormData({
                    ...formData,
                    logo: file,
                });
                const objectUrl = URL.createObjectURL(file);
                setLogoPreview(objectUrl);
                setLogoChanged(true);
            } else {
                mostrarNotificacion('Por favor, sube una imagen válida (PNG o JPEG)', 'error');
            }
        }
    };

    const handleCancelLogo = () => {
        setOpenConfirmDialog(true); // Abre el diálogo de confirmación
    };

    const handleCancelDatos = () => {
        // Restaura los datos originales cargados desde el backend
        const originalData = {
            id_empresa: formData.id_empresa,
            nombre_empresa: formData.nombre_empresa,
            direccion: formData.direccion,
            telefono: formData.telefono,
            correo_electronico: formData.correo_electronico,
            descripcion: formData.descripcion,
            slogan: formData.slogan,
        };
    
        setFormData(originalData); // Restablece los datos originales
        setHasChanges(false); // Marca que no hay cambios pendientes
        setIsEditingDatos(false); // Cierra el modo de edición
    };
    
    const handleConfirmCancelLogo = () => {
        setLogoPreview(originalLogo); // Restaura el logo original
        setFormData({ ...formData, logo: null }); // Elimina el archivo cargado
        setLogoChanged(false); // Marca que no hay cambios en el logo
        setOpenConfirmDialog(false); // Cierra el diálogo
    };

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;

        if (!formData.nombre_empresa) errors.nombre_empresa = "El nombre de la empresa es obligatorio.";
        if (!formData.direccion) errors.direccion = "La dirección es obligatoria.";
        if (!formData.telefono || !phoneRegex.test(formData.telefono)) errors.telefono = "El teléfono es inválido.";
        if (!formData.correo_electronico || !emailRegex.test(formData.correo_electronico)) errors.correo_electronico = "El correo electrónico es inválido.";
        if (!formData.descripcion) errors.descripcion = "La descripción es obligatoria.";
        if (!formData.slogan) errors.slogan = "El slogan es obligatorio.";

        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const mostrarNotificacion = (mensaje, tipo) => {
        setNotification({
            open: true,
            message: mensaje,
            type: tipo,
        });
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const handleSaveLogo = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('id_empresa', formData.id_empresa);
        formDataToSend.append('logo', formData.logo);

        try {
            const response = await axios.put('https://backendodontologia.onrender.com/api/perfilEmpresa/updateLogo', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                mostrarNotificacion('Logo actualizado con éxito', 'success');
                setLogoChanged(false);
                setIsEditingLogo(false);
                setOriginalLogo(logoPreview); // Actualiza el logo original con el nuevo
            } else {
                mostrarNotificacion('Error al actualizar el logo', 'error');
            }
        } catch (error) {
            mostrarNotificacion('Error al actualizar el logo', 'error');
        }
    };
    const handleSaveDatos = async (e) => {
        e.preventDefault();
        if (!dataFetched) {
            mostrarNotificacion('No hay información para actualizar', 'error');
            return;
        }
    
        if (!validateForm()) return;
    
        const formDataToSend = {
            id_empresa: formData.id_empresa,
            nombre_empresa: formData.nombre_empresa,
            direccion: formData.direccion,
            telefono: formData.telefono,
            correo_electronico: formData.correo_electronico,
            descripcion: formData.descripcion,
            slogan: formData.slogan,
        };
    
        try {
            const response = await axios.put('https://backendodontologia.onrender.com/api/perfilEmpresa/updateDatos', formDataToSend);
    
            if (response.status === 200) {
                mostrarNotificacion('Datos actualizados con éxito', 'success');
                setHasChanges(false);
                setIsEditingDatos(false);
            } else {
                mostrarNotificacion('Error al actualizar los datos', 'error');
            }
        } catch (error) {
            mostrarNotificacion('Error al actualizar los datos', 'error');
        }
    };

    const handleOpenImageModal = () => {
        setOpenImageModal(true); // Abre el modal de la imagen
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false); // Cierra el modal de la imagen
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: 'rgba(173, 216, 230, 0.2)', position: 'relative' }}>
            <Container maxWidth="md">
                <IconButton
                    component={Link}
                    to="/Usuarios/Administrador/principal"
                    sx={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        color: 'gray',
                    }}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>

                <Box sx={{ mt: 6, backgroundColor: '#fff', padding: 4, borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Perfil de la Empresa
                        </Typography>

                        <Avatar
                            src={logoPreview}
                            alt="Logo de la empresa"
                            onClick={handleOpenImageModal} // Abre el modal al hacer clic
                            sx={{
                                width: 100,
                                height: 100,
                                margin: '0 auto',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: 2,
                                cursor: 'pointer',
                            }}
                        />

                        <IconButton
                            color="primary"
                            component="label"
                            sx={{ position: 'relative', bottom: 0, mt: 1 }}
                            onClick={() => setIsEditingLogo(true)}
                        >
                            <PhotoCameraIcon />
                            <input type="file" hidden onChange={handleFileChange} />
                        </IconButton>

                        {logoChanged && (
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancelLogo} sx={{ mr: 2 }}>
                                    Cancelar
                                </Button>
                                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveLogo}>
                                    Guardar
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Modal para la imagen ampliada */}
                    <Modal open={openImageModal} onClose={handleCloseImageModal}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '80%',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                textAlign: 'center',
                            }}
                        >
                            <img
                                src={logoPreview}
                                alt="Logo ampliado"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                            <Button onClick={handleCloseImageModal} sx={{ mt: 2 }}>
                                Cerrar
                            </Button>
                        </Box>
                    </Modal>
                    <form onSubmit={handleSaveDatos}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nombre de la Empresa"
                                    name="nombre_empresa"
                                    value={formData.nombre_empresa}
                                    onChange={handleInputChange}
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.nombre_empresa}
                                    helperText={errorMessages.nombre_empresa}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.direccion}
                                    helperText={errorMessages.direccion}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.telefono}
                                    helperText={errorMessages.telefono}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Correo Electrónico"
                                    type="email"
                                    name="correo_electronico"
                                    value={formData.correo_electronico}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.correo_electronico}
                                    helperText={errorMessages.correo_electronico}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    name="descripcion"
                                    multiline
                                    rows={4}
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.descripcion}
                                    helperText={errorMessages.descripcion}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Slogan"
                                    name="slogan"
                                    value={formData.slogan}
                                    onChange={handleInputChange}
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.slogan}
                                    helperText={errorMessages.slogan}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                {!isEditingDatos ? (
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => setIsEditingDatos(true)}
                                    >
                                        Editar
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleCancelDatos} sx={{ mr: 2 }}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSaveDatos}
                                            disabled={!hasChanges}
                                        >
                                            Guardar
                                        </Button>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </Box>

                <RedesSociales />
            </Container>

            <Notificaciones
                open={notification.open}
                message={notification.message}
                type={notification.type}
                handleClose={handleCloseNotification}
            />

            {/* Diálogo de confirmación para cancelar cambios en el logo */}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>{"Confirmar cancelación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Deseas deshacer los cambios realizados en el logo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmCancelLogo} color="primary" autoFocus>
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PerfilEmpresa;
