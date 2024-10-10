// src/componentes/LayoutConEncabezado.js
import React from 'react';
import BarraNav from './Barradenav';
import PieDePagina from './Footer'; // Asegúrate de importar el Footer correctamente
import { Layout } from 'antd';

const { Content } = Layout;

const LayoutConEncabezado = ({ children }) => {
  return (
    <Layout className="layout">
      <header>
        <BarraNav />
      </header>
      <Content style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        {children}
      </Content>
      <footer>
        <PieDePagina />
      </footer>
    </Layout>
  );
}

export default LayoutConEncabezado;
