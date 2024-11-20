import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCalendarAlt, FaSignOutAlt, FaHome, FaCog, FaBell, FaTooth } from 'react-icons/fa';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Notificaciones from '../Compartidos/Notificaciones';

const BarraPaciente = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);
    const navigate = useNavigate(); // Hook de navegación

    // Detectar el tema del sistema
    useEffect(() => {
        const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkTheme(matchDarkTheme.matches);

        const handleThemeChange = (e) => {
            setIsDarkTheme(e.matches);
        };

        matchDarkTheme.addEventListener('change', handleThemeChange);

        return () => {
            matchDarkTheme.removeEventListener('change', handleThemeChange);
        };
    }, []);

    // Abrir el menú
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Cerrar el menú
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose(); // Cierra el menú
        setOpenNotification(true); // Activa la notificación
    
        try {
            const response = await fetch('https://backendodontologia.onrender.com/api/users/logout', {
                method: 'POST',
                credentials: 'include', // Asegura enviar las cookies con la solicitud
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                // Manejar errores específicos según el código de estado de la respuesta
                const errorData = await response.json();
                console.error('Error en el cierre de sesión:', errorData.message || 'Error desconocido');
                throw new Error(errorData.message || 'Error al cerrar sesión.');
            }
    
            // Confirmar que la cookie fue eliminada en el servidor
            console.log('Sesión cerrada exitosamente en el servidor.');
    
            // Limpiar cualquier estado relacionado con la sesión del cliente
            localStorage.removeItem('loggedIn'); // Elimina el estado de sesión almacenado localmente
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setNotificationMessage('Error al cerrar sesión. Inténtalo nuevamente.');
        } finally {
            setTimeout(() => {
                navigate('/'); // Redirige después de que la notificación aparezca
            }, 2000); // Espera 2 segundos antes de redirigir
        }
    };
    
    

    // Cerrar la notificación
    const handleNotificationClose = () => {
        setOpenNotification(false);
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: isDarkTheme ? '#333' : '#F0F0F0',
                    color: isDarkTheme ? '#fff' : '#333',
                    boxShadow: 3,
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Logo de la barra y título */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FaTooth style={{ fontSize: 32, marginRight: '8px', color: isDarkTheme ? '#fff' : '#333' }} />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                fontWeight: 'bold',
                                letterSpacing: 1,
                                color: isDarkTheme ? '#fff' : '#333',
                            }}
                        >
                            Odontología Carol
                        </Typography>
                    </Box>

                    {/* Icono del perfil del paciente */}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMenuOpen}
                        sx={{
                            '&:hover': { color: '#0066cc' },
                            color: isDarkTheme ? '#fff' : '#333',
                        }}
                    >
                        <AccountCircleIcon sx={{ fontSize: 38 }} />
                    </IconButton>

                    {/* Menú desplegable del paciente */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style: {
                                backgroundColor: isDarkTheme ? '#333' : '#fff',
                                color: isDarkTheme ? '#fff' : '#333',
                            },
                        }}
                    >
                        <MenuItem
                            component={Link}
                            to="/Paciente/principal"
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaHome style={{ marginRight: 8 }} />
                            Inicio
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/Paciente/perfil"
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaUserCircle style={{ marginRight: 8 }} />
                            Perfil
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/Paciente/citas"
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaCalendarAlt style={{ marginRight: 8 }} />
                            Citas
                        </MenuItem>

                        <MenuItem
                            component={Link}
                            to="/Paciente/notificaciones"
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaBell style={{ marginRight: 8 }} />
                            Notificaciones
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            component={Link}
                            to="/Paciente/configuracion"
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaCog style={{ marginRight: 8 }} />
                            Configuración
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            onClick={handleLogout} // Cerrar sesión y mostrar notificación
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaSignOutAlt style={{ marginRight: 8 }} />
                            Cerrar sesión
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Notificación de cierre de sesión */}
            <Notificaciones
                open={openNotification}
                message="Has cerrado sesión exitosamente"
                type="info"
                handleClose={handleNotificationClose}
            />
        </>
    );
}

export default BarraPaciente;
