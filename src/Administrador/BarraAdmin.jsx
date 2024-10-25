import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaCalendarAlt, FaSignOutAlt, FaHome, FaCog, FaBell } from 'react-icons/fa'; // Nuevos iconos
import { FaTooth } from 'react-icons/fa'; // Icono para "Odontología Carol"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BarraPaciente = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // Para manejar el menú desplegable

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

    return (
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
                    component={Link} // Usamos el componente Link
                    to="/Administrador/principal" // La ruta a la que quieres redirigir
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none', // Para quitar el subrayado típico de los enlaces
                        color: 'inherit', // Inherita el color para que no cambie por defecto a azul
                    }}
                    onClick={handleMenuClose} // Llama a la misma función para cerrar el menú si es necesario
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
                        '&:hover': { color: '#0066cc' }, // Cambia el color del icono al pasar el puntero
                        color: isDarkTheme ? '#fff' : '#333', // Color por defecto según el tema
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
                    {/* Nueva opción Inicio */}
                    <MenuItem
                        component={Link}
                        to="/Administrador/principal"
                        onClick={handleMenuClose}
                        sx={{
                            '&:hover': { color: '#0066cc' }, // Cambia el color de icono y texto
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
                            '&:hover': { color: '#0066cc' }, // Cambia el color de icono y texto
                        }}
                    >
                        <FaCalendarAlt style={{ marginRight: 8 }} />
                        Reportes
                    </MenuItem>

                    <Divider />

                    <MenuItem
                        component={Link}
                        to="/Administrador/configuracion" // Asegúrate de que la ruta coincide con la definida en App.js
                        onClick={handleMenuClose}
                        sx={{
                            '&:hover': { color: '#0066cc' }, // Cambia el color de icono y texto
                        }}
                    >
                        <FaCog style={{ marginRight: 8 }} />
                        Configuración
                    </MenuItem>

                    <Divider />

                    <MenuItem
                        component={Link}
                        to="/"
                        onClick={handleMenuClose}
                        sx={{
                            '&:hover': { color: '#0066cc' }, // Cambia el color de icono y texto
                        }}
                    >
                        <FaSignOutAlt style={{ marginRight: 8 }} />
                        Cerrar sesión
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default BarraPaciente;
