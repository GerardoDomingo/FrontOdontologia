import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Badge,
  Avatar,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaCalendarAlt, 
  FaSignOutAlt, 
  FaHome, 
  FaCog, 
  FaBell, 
  FaTooth,
  FaFileAlt,
  FaPills,
  FaWallet,
  FaChartLine,
  FaComments,
  FaClinicMedical,
  FaQuestionCircle,
  FaFileMedical
} from 'react-icons/fa';
import Notificaciones from '../../Compartidos/Notificaciones';

const BarraPaciente = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationCount, setNotificationCount] = useState(2); // Para ejemplo
    const navigate = useNavigate();

    // Detectar tema del sistema
    useEffect(() => {
        const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkTheme(matchDarkTheme.matches);

        const handleThemeChange = (e) => {
            setIsDarkTheme(e.matches);
        };

        matchDarkTheme.addEventListener('change', handleThemeChange);
        return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
    }, []);

    const menuItems = [
        { icon: FaHome, text: 'Inicio', path: '/Paciente/principal', divider: false },
        { icon: FaUserCircle, text: 'Mi Perfil', path: '/Paciente/perfil', divider: false },
        { icon: FaCalendarAlt, text: 'Mis Citas', path: '/Paciente/citas', divider: false },
        { icon: FaFileMedical, text: 'Historial Clínico', path: '/Paciente/historial', divider: false },
        { icon: FaPills, text: 'Tratamientos', path: '/Paciente/tratamientos', divider: false },
        { icon: FaFileAlt, text: 'Recetas', path: '/Paciente/recetas', divider: false },
        { icon: FaWallet, text: 'Pagos', path: '/Paciente/pagos', divider: false },
        { icon: FaChartLine, text: 'Progreso', path: '/Paciente/progreso', divider: true },
        { icon: FaComments, text: 'Mensajes', path: '/Paciente/mensajes', divider: false },
        { icon: FaBell, text: 'Notificaciones', path: '/Paciente/notificaciones', divider: false },
        { icon: FaQuestionCircle, text: 'Ayuda', path: '/Paciente/ayuda', divider: true },
        { icon: FaCog, text: 'Configuración', path: '/Paciente/configuracion', divider: true },
        { icon: FaSignOutAlt, text: 'Cerrar Sesión', path: null, divider: false }
    ];

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        setOpenNotification(true);
        try {
            const response = await fetch('https://backendodontologia.onrender.com/api/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cerrar sesión.');
            }
            localStorage.removeItem('loggedIn');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setNotificationMessage('Error al cerrar sesión. Inténtalo nuevamente.');
        } finally {
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    };

    const handleItemClick = (item) => {
        if (item.text === 'Cerrar Sesión') {
            handleLogout();
        } else {
            handleMenuClose();
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: isDarkTheme ? '#1B2A3A' : '#F9FDFF',
                    color: isDarkTheme ? '#fff' : '#03427c',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FaTooth style={{ 
                            fontSize: 32, 
                            color: '#03427c',
                            filter: isDarkTheme ? 'brightness(1.5)' : 'none'
                        }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                letterSpacing: 1,
                                color: isDarkTheme ? '#fff' : '#03427c',
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            Odontología Carol
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            size="large"
                            color="inherit"
                            sx={{ '&:hover': { color: '#0066cc' } }}
                        >
                            <Badge badgeContent={notificationCount} color="error">
                                <FaBell />
                            </Badge>
                        </IconButton>
                        
                        <IconButton
                            edge="end"
                            onClick={handleMenuOpen}
                            sx={{
                                '&:hover': { transform: 'scale(1.05)' },
                                transition: 'transform 0.2s'
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: '#03427c',
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <FaUserCircle />
                            </Avatar>
                        </IconButton>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: isDarkTheme ? '#1B2A3A' : '#F9FDFF',
                                color: isDarkTheme ? '#fff' : '#03427c',
                                width: 220,
                                borderRadius: 2,
                                mt: 1,
                            }
                        }}
                    >
                        {menuItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <MenuItem
                                    component={item.path ? Link : 'button'}
                                    to={item.path}
                                    onClick={() => handleItemClick(item)}
                                    sx={{
                                        py: 1.6,
                                        '&:hover': {
                                            backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(3,66,124,0.1)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                        <item.icon size={20} />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem',
                                            fontWeight: 500
                                        }}
                                    />
                                </MenuItem>
                                {item.divider && <Divider sx={{ my: 1 }} />}
                            </React.Fragment>
                        ))}
                    </Menu>
                </Toolbar>
            </AppBar>
            <Toolbar /> {/* Espaciador para el contenido debajo del AppBar fijo */}

            <Notificaciones
                open={openNotification}
                message="Has cerrado sesión exitosamente. Redirigiendo.."
                type="info"
                handleClose={() => setOpenNotification(false)}
            />
        </>
    );
}

export default BarraPaciente;