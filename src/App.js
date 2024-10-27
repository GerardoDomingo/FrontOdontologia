import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

//Inicio
import Home from './Inicio/Home';
import Register from './Inicio/Register';
import Login from './Inicio/Login';
import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';
import Recuperacion from './Inicio/Recuperacion.jsx';
import Reset from './Inicio/CambiarContrasena.jsx';

//Paciente
import Principal from './Paciente/Principal.jsx';
import LayoutPaciente from './Paciente/LayoutPaciente';

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
      alert("Error al cargar los datos de la empresa. Por favor, intente más tarde.");
    }
  };

  // useEffect para cargar los datos de la empresa al inicio y periódicamente
  useEffect(() => {
    fetchTitleAndLogo();
    const interval = setInterval(fetchTitleAndLogo, 20000); 
    return () => clearInterval(interval);
  }, []);

  // Rutas agrupadas por tipo
  const publicRoutes = [
    { path: "/", component: <Home /> },
    { path: "/register", component: <Register /> },
    { path: "/recuperacion", component: <Recuperacion /> },
    { path: "/resetContra", component: <Reset /> },
    { path: "/login", component: <Login /> },
  ];

  const patientRoutes = [
    { path: "/Paciente/principal", component: <Principal /> },
  ];

  const adminRoutes = [
    { path: "/Administrador/principal", component: <PrincipalAdmin /> },
    { path: "/Administrador/configuracion", component: <Configuracion /> },
    { path: "/Administrador/reportes", component: <Reportes /> },
    { path: "/Administrador/PerfilEmpresa", component: <PerfilEmpresa /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Mapeo de rutas públicas con layout de encabezado */}
        {publicRoutes.map(({ path, component }, index) => (
          <Route key={index} path={path} element={<LayoutConEncabezado>{component}</LayoutConEncabezado>} />
        ))}

        {/* Mapeo de rutas para pacientes con layout específico */}
        {patientRoutes.map(({ path, component }, index) => (
          <Route key={index} path={path} element={<LayoutPaciente>{component}</LayoutPaciente>} />
        ))}

        {/* Mapeo de rutas administrativas con layout de administrador */}
        {adminRoutes.map(({ path, component }, index) => (
          <Route key={index} path={path} element={<LayoutAdmin>{component}</LayoutAdmin>} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
