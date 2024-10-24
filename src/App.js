import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Para hacer solicitudes al backend

//Inicio
import Home from './Inicio/Home';
import Register from './Inicio/Register';
import Login from './Inicio/Login';
import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';
import Recuperacion from './Inicio/Recuperacion.jsx';
import Reset from './Inicio/CambiarContrasena.jsx';

//Paciente
import Principal from './Paciente/Principal.jsx';
import LayoutPaciente from './Paciente/LayoutPaciente'; // Nuevo layout específico para pacientes

//Administrador
import LayoutAdmin from './Administrador/LayoutAdmin.jsx';
import PrincipalAdmin from './Administrador/Principal.jsx';
import Configuracion from './Administrador/Configuracion.jsx';
import Reportes from './Administrador/reportes.jsx';
import PerfilEmpresa from './Administrador/PerfilEmpresa.jsx';

function App() {
  const [tituloPagina, setTituloPagina] = useState(''); // Para el título de la página
  const [logo, setLogo] = useState(''); // Para el logo (favicon)

  // Función para cargar los datos del título y el logo desde el backend
  const fetchTitleAndLogo = async () => {
    try {
      const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/getTitleAndLogo');
      const { titulo_pagina, logo } = response.data;

      // Actualizar el título de la página
      if (titulo_pagina) {
        document.title = titulo_pagina;
        setTituloPagina(titulo_pagina);
      }

      // Actualizar el favicon dinámicamente con el logo
      if (logo) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `data:image/png;base64,${logo}`; // Usar el logo en base64 como favicon
        document.getElementsByTagName('head')[0].appendChild(link);
        setLogo(`data:image/png;base64,${logo}`);
      }
    } catch (error) {
      console.error('Error al obtener los datos del backend:', error);
    }
  };

  // useEffect para cargar los datos de la empresa al inicio y periódicamente
  useEffect(() => {
    fetchTitleAndLogo();
    const interval = setInterval(fetchTitleAndLogo, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LayoutConEncabezado><Home /></LayoutConEncabezado>} />
        <Route path="/register" element={<LayoutConEncabezado><Register /></LayoutConEncabezado>} />
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/resetContra" element={<Reset />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas del paciente */}
        <Route path="/Paciente/principal" element={<LayoutPaciente><Principal /></LayoutPaciente>} />

        {/* Rutas administrativas */}
        <Route path="/Administrador/principal" element={<LayoutAdmin><PrincipalAdmin /></LayoutAdmin>} />
        <Route path="/Administrador/configuracion" element={<LayoutAdmin><Configuracion /></LayoutAdmin>} />
        <Route path="/Administrador/reportes" element={<LayoutAdmin><Reportes /></LayoutAdmin>} />
        <Route path="/Administrador/PerfilEmpresa" element={<LayoutAdmin><PerfilEmpresa /></LayoutAdmin>} />
      </Routes>
    </Router>
  );
}

export default App;
