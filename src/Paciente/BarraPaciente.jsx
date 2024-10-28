import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCalendarAlt, FaSignOutAlt, FaHome, FaCog, FaBell, FaTooth } from 'react-icons/fa';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BarraPaciente = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate(); // Hook para redirigir al usuario

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

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            const response = await fetch('https://backendodontologia.onrender.com/api/users/logout', {
                method: 'POST',
                credentials: 'include', // Para enviar la cookie de sesión
            });

            if (response.ok) {
                // Redirigir al usuario a la página de inicio de sesión
                navigate('/');
            } else {
                console.error('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error de conexión al cerrar sesión:', error);
        }
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

                    {/* Cerrar sesión */}
                    <MenuItem
                        onClick={() => {
                            handleLogout(); // Llama a handleLogout
                            handleMenuClose();
                        }}
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
    );
}

export default BarraPaciente;
