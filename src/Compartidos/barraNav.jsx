// BarraNav.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTooth, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const BarraNav = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

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

  // Estilos dinámicos basados en el tema
  const navbarStyles = {
    backgroundColor: isDarkTheme ? '#333' : '#f0f0f0',
    padding: '0.8rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const navbarListStyles = {
    listStyle: 'none',
    display: 'flex',
    gap: '1.5rem',
    margin: 0,
    padding: 0,
  };

  const navbarLinkStyles = {
    color: isDarkTheme ? 'white' : '#333',
    textDecoration: 'none',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'color 0.3s ease',
  };

  const iconStyles = {
    fontSize: '1.2rem',
  };

  // Hover siempre de color azul
  const handleMouseOver = (e) => {
    e.target.style.color = '#0066cc';
  };

  const handleMouseOut = (e) => {
    e.target.style.color = isDarkTheme ? 'white' : '#333';
  };

  return (
    <nav style={navbarStyles}>
      <ul style={navbarListStyles}>

        <li>
          <Link
            to="/"
            style={navbarLinkStyles}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <FaTooth style={iconStyles} /> Odontología Carol
          </Link>
        </li>
      </ul>
      <ul style={navbarListStyles}>
        <li>
          <Link
            to="/login"
            style={navbarLinkStyles}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <FaSignInAlt style={iconStyles} /> Iniciar sesión
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            style={navbarLinkStyles}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <FaUserPlus style={iconStyles} /> Registrarte
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default BarraNav;
