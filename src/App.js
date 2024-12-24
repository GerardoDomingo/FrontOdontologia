import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import PrivateRoute from './Compartidos/PrivateRoute.jsx';

//Inicio
import Home from './Inicio/Home';
import Register from './Inicio/Register';
import Login from './Inicio/Login.jsx';
import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';
import Recuperacion from './Inicio/Recuperacion.jsx';
import Reset from './Inicio/CambiarContrasena.jsx';
import Agendar from './Inicio/Agendar.jsx';
import Acerca from './Inicio/AcerdaDe.jsx';
import Contactanos from './Inicio/Contactanos.jsx';
import Preguntas from './Inicio/Preguntas.jsx';

//Paciente
import Principal from './Usuarios/Paciente/Principal.jsx';
import LayoutPaciente from './Usuarios/Paciente/LayoutPaciente';

//Administrador
import LayoutAdmin from './Usuarios/Administrador/LayoutAdmin.jsx';
import PrincipalAdmin from './Usuarios/Administrador/Principal.jsx';
import Configuracion from './Usuarios/Administrador/Configuracion.jsx';
import Reportes from './Usuarios/Administrador/Configuracion/reportes.jsx';
import PerfilEmpresa from './Usuarios/Administrador/Configuracion/PerfilEmpresa.jsx';

function App() {
  const [tituloPagina, setTituloPagina] = useState('Mi Empresa'); 
  const [logo, setLogo] = useState('');
  const [fetchErrors, setFetchErrors] = useState(0);
  const [loading, setLoading] = useState(true); 

  const fetchTitleAndLogo = async (retries = 3) => {
    try {
      const response = await axios.get('https://backendodontologia.onrender.com/api/perfilEmpresa/getTitleAndLogo');
      const { nombre_empresa, logo } = response.data;

      if (nombre_empresa) {
        document.title = nombre_empresa; 
        setTituloPagina(nombre_empresa);
      }
      if (logo) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `data:image/png;base64,${logo}`;
        document.getElementsByTagName('head')[0].appendChild(link);
        setLogo(`data:image/png;base64,${logo}`);
      }
      setFetchErrors(0);
      setLoading(false); // Carga completa
    } catch (error) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.status);
      } else if (error.request) {
        console.error("Error en la solicitud:", error.request);
      } else {
        console.error("Error desconocido:", error.message);
      }

      if (retries > 0) {
        await new Promise((res) => setTimeout(res, 1000));
        fetchTitleAndLogo(retries - 1);
      } else {
        setFetchErrors((prev) => prev + 1);
        setLoading(false); // Evita que siga cargando indefinidamente
      }
    }
  };

  useEffect(() => {
    fetchTitleAndLogo();
    const interval = setInterval(fetchTitleAndLogo, 4500);

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
        <Route path="/" element={<LayoutConEncabezado><Home /> <Preguntas/></LayoutConEncabezado>} />
        <Route path="/FAQ" element={<LayoutConEncabezado> <Preguntas/></LayoutConEncabezado>} />
        <Route path="/Contact" element={<LayoutConEncabezado> <Contactanos/></LayoutConEncabezado>} />
        <Route path="/register" element={<LayoutConEncabezado><Register /></LayoutConEncabezado>} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendar-cita" element={<Agendar />} />
        <Route path="/about" element={<LayoutConEncabezado><Acerca /></LayoutConEncabezado>} />
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/resetContra" element={<Reset />} />

        {/* Rutas protegidas del paciente */}
        <Route path="/Paciente/principal" element={<PrivateRoute><LayoutPaciente><Principal /></LayoutPaciente></PrivateRoute>} />

        {/* Rutas protegidas del administrador */}
        <Route path="/Administrador/principal" element={<PrivateRoute><LayoutAdmin><PrincipalAdmin /></LayoutAdmin></PrivateRoute>} />
        <Route path="/Administrador/configuracion" element={<PrivateRoute><LayoutAdmin><Configuracion /></LayoutAdmin></PrivateRoute>} />
        <Route path="/Administrador/reportes" element={<PrivateRoute><LayoutAdmin><Reportes /></LayoutAdmin></PrivateRoute>} />
        <Route path="/Administrador/PerfilEmpresa" element={<PrivateRoute><LayoutAdmin><PerfilEmpresa /></LayoutAdmin></PrivateRoute>} />
      </Routes>
      {!loading ? null : <div>Cargando configuración de empresa...</div>} {/* Mensaje de carga opcionall */}
    </Router>
  );
}

export default App;
//APP
