import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { FaTooth, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

const BarraNav = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

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
              <FaTooth style={{ marginRight: '10px', fontSize: '1.5rem' }} />
              <ListItemText primary="Odontología Carol" />
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
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <ListItem button component={Link} to="/register">
              <FaUserPlus style={{ marginRight: '10px', fontSize: '1.5rem' }} />
              <ListItemText primary="Registrarte" />
            </ListItem>
          </motion.div>
        </List>
      </Box>
    </motion.div>
  );

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
        <Toolbar>
          {/* Logo y nombre de la empresa */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: isDarkTheme ? 'white' : '#333',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              '&:hover': {
                color: isDarkTheme ? '#82B1FF' : '#0066cc',
              },
            }}
          >
            <FaTooth style={{ fontSize: '1.5rem', marginRight: '8px' }} />
            Odontología Carol
          </Typography>

          {/* Links de Login y Registro, con responsividad */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <IconButton
              component={Link}
              to="/login"
              sx={{
                color: isDarkTheme ? 'white' : '#333',
                '&:hover': { color: '#0066cc' },
              }}
            >
              <FaSignInAlt />
              <Typography sx={{ marginLeft: '8px' }}>Iniciar sesión</Typography>
            </IconButton>
            <IconButton
              component={Link}
              to="/register"
              sx={{
                color: isDarkTheme ? 'white' : '#333',
                '&:hover': { color: '#0066cc' },
              }}
            >
              <FaUserPlus />
              <Typography sx={{ marginLeft: '8px' }}>Registrarte</Typography>
            </IconButton>
          </Box>

          {/* Menú en pantallas pequeñas */}
          <IconButton
            edge="end"
            sx={{ display: { xs: 'block', md: 'none' }, color: isDarkTheme ? 'white' : '#333' }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
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