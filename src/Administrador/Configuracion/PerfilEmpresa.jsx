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
} from '@mui/material';
import { Save as SaveIcon, Edit as EditIcon, Close as CloseIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import axios from 'axios';
import Notificaciones from '../../Compartidos/Notificaciones';
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
        slogan: '',
        titulo_pagina: ''
    });
    const [logoPreview, setLogoPreview] = useState('');
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

    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            try {
                const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/get');
                const { id_empresa, nombre_empresa, direccion, telefono, correo_electronico, descripcion, logo, slogan, titulo_pagina } = response.data;

                if (id_empresa) {
                    setFormData({
                        id_empresa,
                        nombre_empresa,
                        direccion,
                        telefono,
                        correo_electronico,
                        descripcion,
                        slogan,
                        titulo_pagina,
                    });
                    setDataFetched(true);
                } else {
                    setDataFetched(false);
                    mostrarNotificacion('No hay información para actualizar, suba su información', 'error');
                }

                if (logo) {
                    setLogoPreview(`data:image/png;base64,${logo}`);
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
        if (!formData.titulo_pagina) errors.titulo_pagina = "El título de la página es obligatorio.";

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
            } else {
                mostrarNotificacion('Error al actualizar el logo', 'error');
            }
        } catch (error) {
            mostrarNotificacion('Error al actualizar el logo', 'error');
        }
    };

    const handleCancelLogo = () => {
        setOpenConfirmDialog(true); // Abrir diálogo de confirmación
    };

    const handleConfirmCancelLogo = () => {
        setIsEditingLogo(false);
        setLogoChanged(false);
        setLogoPreview('');
        setOpenConfirmDialog(false); // Cerrar diálogo
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
            titulo_pagina: formData.titulo_pagina
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
    

    const handleCancelDatos = () => {
        setOpenConfirmDialog(true); // Abrir diálogo de confirmación
    };

    const handleConfirmCancelDatos = () => {
        setIsEditingDatos(false);
        setHasChanges(false);
        setOpenConfirmDialog(false); // Cerrar diálogo
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: 'rgba(173, 216, 230, 0.2)', position: 'relative' }}>
            <Container maxWidth="md">
                <IconButton
                    component={Link}
                    to="/Administrador/principal"
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
                            sx={{
                                width: 100,
                                height: 100,
                                margin: '0 auto',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: 2,
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

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Título de la Página"
                                    name="titulo_pagina"
                                    value={formData.titulo_pagina}
                                    onChange={handleInputChange}
                                    disabled={!isEditingDatos}
                                    error={!!errorMessages.titulo_pagina}
                                    helperText={errorMessages.titulo_pagina}
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
                                            disabled={!hasChanges} // Desactiva el botón si no hay cambios
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

            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>{"Confirmar cancelación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Deseas deshacer los cambios realizados?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmCancelDatos} color="primary" autoFocus>
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PerfilEmpresa;
