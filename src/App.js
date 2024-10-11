// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Inicio/Home';
import Register from './Inicio/Register';
import Login from './Inicio/Login'; 
import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';  

function App() {
  return (
    <Router basename="/Odontologia"> {/* Se añade el basename */}
      <Routes>
        <Route path="/" element={<LayoutConEncabezado><Home /></LayoutConEncabezado>} /> 
        <Route path="/register" element={<LayoutConEncabezado><Register /></LayoutConEncabezado>} /> 
        <Route path="/login" element={<LayoutConEncabezado><Login /></LayoutConEncabezado>} /> 
      </Routes>
    </Router>
  );
}

export default App;
