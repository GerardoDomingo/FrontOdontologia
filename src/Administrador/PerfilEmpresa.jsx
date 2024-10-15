import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    Container,
    Typography,
    Box,
    Avatar,
} from '@mui/material';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones'; // Importar Notificaciones

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
    // Estado para las notificaciones
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success', // 'success' o 'error'
    });

    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/perfilEmpresa/get');
                const { id_empresa, nombre_empresa, direccion, telefono, correo_electronico, descripcion, logo } = response.data;

                console.log('Datos recibidos:', response.data);

                if (id_empresa) {
                    setFormData({
                        id_empresa,
                        nombre_empresa,
                        direccion,
                        telefono,
                        correo_electronico,
                        descripcion,
                    });
                    setDataFetched(true); // Datos fueron obtenidos
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
            setFormData({
                ...formData,
                logo: file,
            });
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);
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
        return Object.keys(errors).length === 0; // Retorna verdadero si no hay errores
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
            const response = await axios.post('http://localhost:3001/api/perfilEmpresa/insert', formDataToSend, {
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
            const response = await axios.put('http://localhost:3001/api/perfilEmpresa/update', formDataToSend, {
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
        <Box sx={{ padding: 15,marginTop: -10 }}>
            <Container maxWidth="sm">
                <Box sx={{ marginTop: 1, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Perfil de la Empresa
                    </Typography>
                    {logoPreview ? (
                        <Avatar
                            src={logoPreview}
                            alt="Logo de la empresa"
                            sx={{
                                width: 150,
                                height: 150,
                                margin: '0 auto',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Typography>No se ha cargado ninguna imagen</Typography>
                    )}
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
                                />
                            </Grid>
                            {isEditing && (
                                <Grid item xs={12}>
                                    <Button variant="contained" component="label">
                                        Subir Logo de la Empresa
                                        <input
                                            type="file"
                                            hidden
                                            name="logo"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit" disabled={false}>
                                
                                    {isEditing ? 'Actualizar' : 'Subir cambios'}
                                </Button>
                       
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{ marginLeft: '10px' }}
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
