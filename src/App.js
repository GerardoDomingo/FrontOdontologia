// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Inicio/Home';
import Register from './Inicio/Register';
import Login from './Inicio/Login'; 
import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';  

//Administrador
import AvisoDePrivacidad from './Administrador/AvisoPriva';
import DeslindeLegal from './Administrador/DeslindeLegal';
import TerminosCondiciones from './Administrador/TermiCondicion';

function App() {
  return (
    <Router basename="/Odontologia"> {/* Se añade el basename */}
      <Routes>
        <Route path="/" element={<LayoutConEncabezado><Home /></LayoutConEncabezado>} /> 
        <Route path="/register" element={<LayoutConEncabezado><Register /></LayoutConEncabezado>} /> 
        <Route path="/login" element={<LayoutConEncabezado><Login /></LayoutConEncabezado>} /> 

        <Route path="/AvisoPriva" element={<LayoutConEncabezado><AvisoDePrivacidad /></LayoutConEncabezado>} /> 
        <Route path="/deslindeLegal" element={<LayoutConEncabezado><DeslindeLegal /></LayoutConEncabezado>} /> 
        <Route path="/terminos" element={<LayoutConEncabezado><TerminosCondiciones /></LayoutConEncabezado>} /> 
      </Routes>
    </Router>
  );
}

export default App;
