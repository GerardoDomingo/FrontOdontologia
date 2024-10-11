// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaTooth } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticación
    if (formData.email === 'usuario@ejemplo.com' && formData.password === '123456') {
      navigate('/');
    } else {
      setErrorMessage('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  // Estilos dinámicos según el tema del sistema
  const backgroundColor = isDarkTheme ? '#1a1a1a' : '#f5f5f5';
  const cardBackgroundColor = isDarkTheme ? '#333' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#333';

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: cardBackgroundColor,
          maxWidth: '400px',
          width: '100%',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          color: textColor,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaTooth style={{ fontSize: '40px', color: '#00bcd4' }} />
          <h2 style={{ color: textColor, marginBottom: '20px', fontSize: '24px' }}>Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', color: textColor }}>Correo Electrónico:</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{ position: 'absolute', left: '10px', top: '12px', color: '#ccc' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Introduce tu correo electrónico"
                style={{
                  padding: '12px 12px 12px 40px',
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <div className="field" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', color: textColor }}>Contraseña:</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: '10px', top: '12px', color: '#ccc' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Introduce tu contraseña"
                style={{
                  padding: '12px 12px 12px 40px',
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          {errorMessage && (
            <p
              style={{
                color: 'red',
                textAlign: 'center',
                marginBottom: '20px',
                backgroundColor: '#ffe5e5',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {errorMessage}
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#00bcd4',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontSize: '18px',
                border: 'none',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#00a3ba')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#00bcd4')}
            >
              Iniciar Sesión
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>
              <Link to="/register" style={{ color: '#00bcd4', textDecoration: 'none' }}>¿No tienes cuenta? Registrarte</Link>
            </p>
            <p>
              <Link to="/forgot-password" style={{ color: '#00bcd4', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
