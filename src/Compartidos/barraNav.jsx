import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Button, Typography, Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material'; // IconButton incluido aquí
import { FaSignInAlt, FaCalendarAlt } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

const BarraNav = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchErrors, setFetchErrors] = useState(0);

  const navigate = useNavigate();

  // Función para obtener logo y nombre de la empresa
  const fetchTitleAndLogo = async (retries = 3) => {
    try {
      const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/getTitleAndLogo');
      const { nombre_empresa, logo } = response.data;
      
      if (nombre_empresa) {
        document.title = nombre_empresa;
        setNombreEmpresa(nombre_empresa);
      }

      if (logo) {
        setLogo(`data:image/png;base64,${logo}`);
      }

      setFetchErrors(0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logo and title:', error);
      
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, 1000));
        fetchTitleAndLogo(retries - 1);
      } else {
        setFetchErrors((prev) => prev + 1);
        setLoading(false);
      }
    }
  };

  // Detectar el tema del sistema
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkTheme(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);
    fetchTitleAndLogo();

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Resto del código de la barra de navegación (toggleDrawer, drawerVariants, etc.) se mantiene igual

  // Función para abrir/cerrar el Drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Animaciones para el Drawer
  const drawerVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: '0', opacity: 1 },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  // Lista de enlaces en el Drawer
  const drawerList = (
    <motion.div
      variants={drawerVariants}
      initial="closed"
      animate={drawerOpen ? 'open' : 'closed'}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          width: 250,
          backgroundColor: isDarkTheme ? '#2A3A4A' : '#f0f0f0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ListItem button component={Link} to="/">
              {logo && <img src={logo} alt="Logo" style={{ marginRight: '10px', width: '30px', height: '30px' }} />}
              <ListItemText primary={nombreEmpresa || "Inicio"} />
            </ListItem>
          </motion.div>
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ListItem button component={Link} to="/login">
              <FaSignInAlt style={{ marginRight: '10px', fontSize: '1.5rem' }} />
              <ListItemText primary="Iniciar sesión" />
            </ListItem>
          </motion.div>
        </List>
      </Box>
    </motion.div>
  );

  if (loading) {
    return null; // O un spinner de carga
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: isDarkTheme ? '#2A3A4A' : '#f0f0f0',
          boxShadow: 'none',
          borderBottom: `1px solid ${isDarkTheme ? '#3A4A5A' : '#e0e0e0'}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo y nombre de la empresa */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              color: isDarkTheme ? 'white' : '#333',
              '&:hover': {
                color: isDarkTheme ? '#82B1FF' : '#0066cc',
              },
            }}
          >
            {logo && (
              <img 
                src={logo} 
                alt="Logo" 
                style={{ 
                  marginRight: '12px', 
                  width: '40px', 
                  height: '40px',
                  borderRadius: '50%' 
                }} 
              />
            )}
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Montserrat", "Roboto", sans-serif',
                fontWeight: 600,
                letterSpacing: '-0.5px',
              }}
            >
              {nombreEmpresa || 'Mi Empresa'}
            </Typography>
          </Box>

          {/* Links de navegación, con responsividad */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography 
                  sx={{ 
                    color: isDarkTheme ? 'white' : '#333',
                    fontFamily: '"Montserrat", sans-serif',
                    '&:hover': { color: '#0066cc' }
                  }}
                >
                  Inicio
                </Typography>
              </Link>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/agendar-cita"
                startIcon={<FaCalendarAlt />}
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  backgroundColor: '#0066cc',
                  '&:hover': { 
                    backgroundColor: '#0052a3',
                  },
                  textTransform: 'none',
                }}
              >
                Agenda una Cita
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to="/login"
                startIcon={<FaSignInAlt />}
                sx={{
                  fontFamily: '"Montserrat", sans-serif',
                  color: isDarkTheme ? 'white' : '#0066cc',
                  borderColor: isDarkTheme ? 'white' : '#0066cc',
                  '&:hover': { 
                    backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,102,204,0.1)',
                    borderColor: isDarkTheme ? 'white' : '#0052a3',
                  },
                  textTransform: 'none',
                }}
              >
                Iniciar sesión
              </Button>
            </Box>

            {/* Menú en pantallas pequeñas */}
            <IconButton
              edge="end"
              sx={{ display: { xs: 'block', md: 'none' }, color: isDarkTheme ? 'white' : '#333' }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para el menú en pantallas pequeñas */}
      {drawerOpen && (
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerList}
        </Drawer>
      )}
    </>
  );
};

export default BarraNav;