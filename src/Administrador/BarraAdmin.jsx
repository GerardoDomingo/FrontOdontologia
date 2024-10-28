import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaCalendarAlt, FaSignOutAlt, FaHome, FaCog, FaTooth } from 'react-icons/fa';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Notificaciones from '../Compartidos/Notificaciones'; // Importar el componente Notificaciones

const BarraAdmin = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // Para manejar el menú desplegable
    const [openNotification, setOpenNotification] = useState(false); // Estado para la notificación

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

    // Función para mostrar la notificación al cerrar sesión
    const handleLogout = () => {
        handleMenuClose(); // Cierra el menú
        setOpenNotification(true); // Activa la notificación
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
                    <Box
                        component={Link}
                        to="/Administrador/principal"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                        onClick={handleMenuClose}
                    >
                        <FaTooth
                            style={{
                                fontSize: 32,
                                marginRight: '8px',
                                color: isDarkTheme ? '#fff' : '#333',
                            }}
                        />
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
                            Odontología Carol - Administrador
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
                            to="/Administrador/principal"
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
                            to="/Administrador/reportes"
                            onClick={handleMenuClose}
                            sx={{
                                '&:hover': { color: '#0066cc' },
                            }}
                        >
                            <FaCalendarAlt style={{ marginRight: 8 }} />
                            Reportes
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            component={Link}
                            to="/Administrador/configuracion"
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
                            onClick={handleLogout} // Activa la función de cierre de sesión y notificación
                            to="/"
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

export default BarraAdmin;
