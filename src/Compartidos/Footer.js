// src/componentes/Footer.js
import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text } = Typography;

const PieDePagina = () => {
    return (
        <Footer style={{ textAlign: 'center', backgroundColor: '#87CEEB', padding: '20px' }}>
            <Text style={{ color: 'white', fontSize: '16px' }}>
                © 2024 Odontología Carol. Todos los derechos reservados.
            </Text>
            <Space style={{ marginTop: '10px' }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                    <FacebookOutlined style={{ fontSize: '20px' }} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                    <InstagramOutlined style={{ fontSize: '20px' }} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                    <TwitterOutlined style={{ fontSize: '20px' }} />
                </a>
            </Space>
        </Footer>
    );
};

export default PieDePagina;
