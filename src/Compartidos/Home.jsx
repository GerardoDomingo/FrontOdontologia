import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate

const Home = () => {
  const navigate = useNavigate(); // Inicializar el hook useNavigate

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido a la Página Principal</h1>
      <p>Explora nuestra aplicación y regístrate para obtener acceso completo.</p>
      
      {/* Botones de Iniciar Sesión y Registrar */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/login')} // Navegar a la página de inicio de sesión
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#007BFF', // Azul para "Iniciar Sesión"
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')} // Efecto hover
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}  // Regresar al color original
        >
          Iniciar Sesión
        </button>

        <button 
          onClick={() => navigate('/register')} // Navegar a la página de registro
          style={{
            padding: '10px 20px',
            backgroundColor: '#28A745', // Verde para "Registrar"
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')} // Efecto hover
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28A745')}  // Regresar al color original
        >
          Registrar
        </button>
      </div>
    </div>
  );
}

export default Home;
