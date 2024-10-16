import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton } from '@mui/material';
import { Lock, ArrowBack } from '@mui/icons-material';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const CambiarContraseña = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchParams] = useSearchParams(); // Hook para obtener los parámetros de la URL
    const navigate = useNavigate();

    const token = searchParams.get('token'); // Obtener el token de la URL
    console.log("Token obtenido de la URL:", token);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!token) {
            setErrorMessage('El token es inválido o ha expirado.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/resetPassword', { token, newPassword });

            if (response.status === 200) {
                setSuccessMessage('Contraseña actualizada correctamente.');
                setTimeout(() => {
                    navigate('/login'); // Redirigir al login después de cambiar la contraseña
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('El token ha expirado o es inválido.');
            } else {
                setErrorMessage('Error al cambiar la contraseña. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                position: 'relative'
            }}
        >
            <IconButton
                sx={{ position: 'absolute', top: 16, left: 16, color: '#00bcd4' }}
                component={Link}
                to="/login" // Ruta para regresar al login
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowBack />
                    <Typography
                        variant="body2"
                        sx={{ color: '#707070', opacity: 0.7, ml: 1 }}
                    >
                        Atrás
                    </Typography>
                </Box>
            </IconButton>

            <Card sx={{ maxWidth: 400, width: '100%', borderRadius: '15px', boxShadow: 3, position: 'relative' }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cambiar Contraseña
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <IconButton sx={{ mr: 1 }}>
                                            <Lock />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Confirmar Contraseña"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <IconButton sx={{ mr: 1 }}>
                                            <Lock />
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>

                        {errorMessage && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'red',
                                    textAlign: 'center',
                                    mb: 3,
                                    backgroundColor: '#ffe5e5',
                                    p: 1,
                                    borderRadius: '15px',
                                }}
                            >
                                {errorMessage}
                            </Typography>
                        )}

                        {successMessage && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'green',
                                    textAlign: 'center',
                                    mb: 3,
                                    backgroundColor: '#e5ffe5',
                                    p: 1,
                                    borderRadius: '15px',
                                }}
                            >
                                {successMessage}
                            </Typography>
                        )}

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#00bcd4',
                                '&:hover': { backgroundColor: '#00a3ba' },
                                py: 1.5,
                                fontSize: '16px',
                            }}
                        >
                            Cambiar Contraseña
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CambiarContraseña;
