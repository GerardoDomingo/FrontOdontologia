import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Principales
import Register from './Compartidos/Register';
import Home from './Compartidos/Home';
import Footer from './Compartidos/Footer';
import Login from './Compartidos/Login'; // Importar el nuevo componente de Login

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Página principal */}
          <Route path="/register" element={<Register />} /> {/* Página de registro */}
          <Route path="/login" element={<Login />} /> {/* Página de inicio de sesión */}
        </Routes>
      </Router>
      <Footer /> {/* Pie de página */}
    </div>
  );
}

export default App;
