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
import Reportes from './Administrador/Configuracion/reportes.jsx';
import PerfilEmpresa from './Administrador/Configuracion/PerfilEmpresa.jsx';

function App() {
  const [tituloPagina, setTituloPagina] = useState('');
  const [logo, setLogo] = useState('');
  const [fetchErrors, setFetchErrors] = useState(0);

  const fetchTitleAndLogo = async (retries = 3) => {
    try {
      const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/getTitleAndLogo');
      const { titulo_pagina, logo } = response.data;

      if (titulo_pagina) {
        document.title = titulo_pagina;
        setTituloPagina(titulo_pagina);
      }
      if (logo) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `data:image/png;base64,${logo}`;
        document.getElementsByTagName('head')[0].appendChild(link);
        setLogo(`data:image/png;base64,${logo}`);
      }
      setFetchErrors(0); // Reinicia el contador de errores si fue exitoso
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.status);
      } else if (error.request) {
        console.error("Error en la solicitud:", error.request);
      } else {
        console.error("Error desconocido:", error.message);
      }

      // Manejo de reintentos
      if (retries > 0) {
        console.log(`Reintentando... (${3 - retries + 1})`);
        await new Promise((res) => setTimeout(res, 1000)); // Espera 1 segundo antes de reintentar
        fetchTitleAndLogo(retries - 1);
      } else {
        setFetchErrors((prev) => prev + 1); // Incrementa el contador de errores
      }
    }
  };

  useEffect(() => {
    fetchTitleAndLogo();
    const interval = setInterval(fetchTitleAndLogo, 15000);

    // Detén los reintentos si hay demasiados errores consecutivos
    if (fetchErrors >= 5) {
      clearInterval(interval);
      console.error("Demasiados errores al intentar conectarse con el backend.");
    }

    return () => clearInterval(interval);
  }, [fetchErrors]);

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
