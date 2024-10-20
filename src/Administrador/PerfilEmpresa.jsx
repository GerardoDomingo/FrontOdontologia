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
} from '@mui/material';
import { UploadFile as UploadFileIcon, Save as SaveIcon, Edit as EditIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { ArrowBack as ArrowBackIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones'; // Importar Notificaciones
import { Link } from 'react-router-dom';

const PerfilEmpresa = () => {
    const [formData, setFormData] = useState({
        id_empresa: '',
        nombre_empresa: '',
        direccion: '',
        telefono: '',
        correo_electronico: '',
        descripcion: '',
        logo: null,
    });
    const [logoPreview, setLogoPreview] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [dataFetched, setDataFetched] = useState(false); // Estado para verificar si hay datos
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success',
    });

    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            try {
                const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/get');
                const { id_empresa, nombre_empresa, direccion, telefono, correo_electronico, descripcion, logo } = response.data;

                if (id_empresa) {
                    setFormData({
                        id_empresa,
                        nombre_empresa,
                        direccion,
                        telefono,
                        correo_electronico,
                        descripcion,
                    });
                    setDataFetched(true); // Datos obtenidos
                } else {
                    setDataFetched(false); // No hay datos
                    mostrarNotificacion('No hay información para actualizar, suba su información', 'error');
                }

                if (logo) {
                    setLogoPreview(`data:image/png;base64,${logo}`);
                }
            } catch (error) {
                console.error('Error al obtener el perfil de la empresa:', error);
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
            } else {
                mostrarNotificacion('Por favor, sube una imagen válida (PNG o JPEG)', 'error');
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.nombre_empresa) errors.nombre_empresa = "El nombre de la empresa es obligatorio.";
        if (!formData.direccion) errors.direccion = "La dirección es obligatoria.";
        if (!formData.telefono) errors.telefono = "El teléfono es obligatorio.";
        if (!formData.correo_electronico) errors.correo_electronico = "El correo electrónico es obligatorio.";
        if (!formData.descripcion) errors.descripcion = "La descripción es obligatoria.";

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

    const handleClose = () => {
        setNotification({ ...notification, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append('nombre_empresa', formData.nombre_empresa);
        formDataToSend.append('direccion', formData.direccion);
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('correo_electronico', formData.correo_electronico);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('logo', formData.logo);

        try {
            const response = await axios.post('https://backendodontologia.onrender.com/api/perfilEmpresa/insert', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                mostrarNotificacion('Perfil de empresa insertado con éxito', 'success');
            } else {
                mostrarNotificacion('Error al insertar el perfil de empresa', 'error');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            mostrarNotificacion('Error al insertar el perfil de empresa', 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!dataFetched) {
            mostrarNotificacion('No hay información para actualizar', 'error');
            return;
        }

        if (!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append('id_empresa', formData.id_empresa);
        formDataToSend.append('nombre_empresa', formData.nombre_empresa);
        formDataToSend.append('direccion', formData.direccion);
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('correo_electronico', formData.correo_electronico);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('logo', formData.logo);

        try {
            const response = await axios.put('https://backendodontologia.onrender.com/api/perfilEmpresa/update', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                mostrarNotificacion('Perfil de empresa actualizado con éxito', 'success');
                setIsEditing(false);
            } else {
                mostrarNotificacion('Error al actualizar el perfil de empresa', 'error');
            }
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            mostrarNotificacion('Error al actualizar el perfil de empresa', 'error');
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f9f9f9', position: 'relative' }}>
            <Container maxWidth="md">

                {/* Botón de regreso */}
                <IconButton
                    component={Link}
                    to="/Administrador/principal"
                    sx={{
                        position: 'absolute',
                        top: 24,
                        left: 24,
                        color: '#1976d2',
                    }}
                >
                    <ArrowBackIcon fontSize="large" />
                </IconButton>

                {/* Botón "X" en la esquina superior derecha */}
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        color: 'gray',
                    }}
                    onClick={() => setIsEditing(false)}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>

                <Box
                    sx={{
                        mt: 6,
                        backgroundColor: '#fff',
                        padding: 4,
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Perfil de la Empresa
                        </Typography>

                        {logoPreview ? (
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
                        ) : (
                            <Typography>No se ha cargado ninguna imagen</Typography>
                        )}
                    </Box>

                    <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre de la Empresa"
                                    name="nombre_empresa"
                                    value={formData.nombre_empresa}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    error={!!errorMessages.nombre_empresa}
                                    helperText={errorMessages.nombre_empresa}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Dirección"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    error={!!errorMessages.direccion}
                                    helperText={errorMessages.direccion}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    error={!!errorMessages.telefono}
                                    helperText={errorMessages.telefono}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Correo Electrónico"
                                    type="email"
                                    name="correo_electronico"
                                    value={formData.correo_electronico}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!isEditing}
                                    error={!!errorMessages.correo_electronico}
                                    helperText={errorMessages.correo_electronico}
                                    sx={{ borderRadius: '12px' }}
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
                                    disabled={!isEditing}
                                    error={!!errorMessages.descripcion}
                                    helperText={errorMessages.descripcion}
                                    sx={{ borderRadius: '12px' }}
                                />
                            </Grid>
                            {isEditing && (
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<UploadFileIcon />}
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            color: '#fff',
                                            borderRadius: '24px',
                                            textTransform: 'none',
                                            padding: '10px 24px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                            },
                                        }}
                                    >
                                        Subir Logo de la Empresa
                                        <input type="file" hidden name="logo" onChange={handleFileChange} />
                                    </Button>
                                </Grid>
                            )}

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    type="submit"
                                    startIcon={isEditing ? <CheckCircleIcon /> : <SaveIcon />}
                                    sx={{
                                        borderRadius: '24px',
                                        padding: '12px 24px',
                                        backgroundColor: '#1976D2',
                                        color: '#fff',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: '#105da5',
                                        },
                                    }}
                                >
                                    {isEditing ? 'Actualizar' : 'Subir cambios'}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={isEditing ? <CheckCircleIcon /> : <EditIcon />}
                                    fullWidth
                                    onClick={() => setIsEditing(!isEditing)}
                                    sx={{
                                        borderRadius: '24px',
                                        padding: '12px 24px',
                                        textTransform: 'none',
                                        borderColor: isEditing ? '#28a745' : '#1976d2',
                                        color: isEditing ? '#28a745' : '#1976d2',
                                        '&:hover': {
                                            borderColor: isEditing ? '#218838' : '#1565c0',
                                            backgroundColor: isEditing ? '#e9f9eb' : '#e8f0ff',
                                        },
                                    }}
                                >
                                    {isEditing ? 'Aceptar cambios' : 'Editar'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>

            {/* Componente de Notificaciones */}
            <Notificaciones
                open={notification.open}
                message={notification.message}
                type={notification.type}
                handleClose={handleClose}
            />
        </Box>
    );
};

export default PerfilEmpresa;
