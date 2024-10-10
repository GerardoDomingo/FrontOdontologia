import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes Principales
import Register from './Compartidos/Register';

import LayoutConEncabezado from './Compartidos/LayoutConEncabezado';

function App() {
  return (
  
    <Router >
      <Routes>
        <Route path="/" element={<LayoutConEncabezado> <Register /> </LayoutConEncabezado> } />
      
      
      </Routes>
    </Router>
  );
};

export default App;
