import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Inicio
import Home from './Inicio/Home';
import Register from './Inicio/Register';
import Login from './Inicio/Login';
import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';
import Recuperacion from './Inicio/Recuperacion.jsx'
import Reset from './Inicio/CambiarContrasena.jsx'

//Paciente
import Principal from './Paciente/Principal.jsx';
import LayoutPaciente from './Paciente/LayoutPaciente'; // Nuevo layout específico para pacientes

//Administrador
import LayoutAdmin from './Administrador/LayoutAdmin.jsx'; 
import PrincipalAdmin from './Administrador/Principal.jsx';
import Configuracion from './Administrador/Configuracion.jsx';
import AvisoDePrivacidad from './Administrador/AvisoPriva';
import DeslindeLegal from './Administrador/DeslindeLegal';
import TerminosCondiciones from './Administrador/TermiCondicion';
import PerfilEmpresa from './Administrador/PerfilEmpresa.jsx';

function App() {
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
        <Route path="/Administrador/configuracion" element={<LayoutAdmin><Configuracion/></LayoutAdmin>} />
        <Route path="/Administrador/AvisoPriva" element={<LayoutAdmin><AvisoDePrivacidad /></LayoutAdmin>} />
        <Route path="/Administrador/deslindeLegal" element={<LayoutAdmin><DeslindeLegal /></LayoutAdmin>} />
        <Route path="/Administrador/terminos" element={<LayoutAdmin><TerminosCondiciones /></LayoutAdmin>} />
        <Route path="/Administrador/PerfilEmpresa" element={<LayoutAdmin><PerfilEmpresa /></LayoutAdmin>} />

      </Routes>
    </Router>
  );
}

export default App;
