import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar tu lógica de autenticación
    if (formData.email === 'usuario@ejemplo.com' && formData.password === '123456') {
      // Si la autenticación es exitosa, navega a la página principal o a una página protegida
      navigate('/');
    } else {
      setErrorMessage('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#14161A',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          backgroundColor: '#fff',
          maxWidth: '400px',
          width: '100%',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', fontSize: '24px' }}>
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: '20px' }}>
            <label className="label" style={{ fontWeight: 'bold', color: '#333' }}>Correo Electrónico:</label>
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Introduce tu correo electrónico"
              style={{
                padding: '12px',
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div className="field" style={{ marginBottom: '20px' }}>
            <label className="label" style={{ fontWeight: 'bold', color: '#333' }}>Contraseña:</label>
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Introduce tu contraseña"
              style={{
                padding: '12px',
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
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
          <div className="control" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              className="button is-primary"
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
        </form>
      </div>
    </div>
  );
};

export default Login;
