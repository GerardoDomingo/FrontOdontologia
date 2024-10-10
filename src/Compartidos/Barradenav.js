// src/componentes/BarraNav.js
import React from 'react';
import { Layout, Menu, Input } from 'antd';
import { LoginOutlined, UserAddOutlined, HomeOutlined, TeamOutlined, PhoneOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Search } = Input;

const BarraNav = () => {
    const onSearch = (value) => {
        console.log(value);
    };

    return (
        <Header style={{ backgroundColor: '#87CEEB', padding: '0 20px' }}>
            <div className="logo" style={{ color: 'white', fontSize: '24px', textAlign: 'center', lineHeight: '64px' }}>
                Odontología Carol
            </div>
            <Menu 
                theme="dark" 
                mode="horizontal" 
                defaultSelectedKeys={['1']} 
                style={{ justifyContent: 'flex-end', backgroundColor: '#87CEEB', lineHeight: '64px' }}
            >
                <Menu.Item key="1" icon={<HomeOutlined />} style={{ margin: '0 20px' }}>
                    <a href="#home" style={{ color: 'white' }}>Inicio</a>
                </Menu.Item>
                <Menu.Item key="2" icon={<TeamOutlined />} style={{ margin: '0 20px' }}>
                    <a href="#servicios" style={{ color: 'white' }}>Servicios</a>
                </Menu.Item>
                <Menu.Item key="3" icon={<LoginOutlined />} style={{ margin: '0 20px' }}>
                    <a href="#login" style={{ color: 'white' }}>Login</a>
                </Menu.Item>
                <Menu.Item key="4" icon={<UserAddOutlined />} style={{ margin: '0 20px' }}>
                    <a href="#registro" style={{ color: 'white' }}>Registro</a>
                </Menu.Item>
                <Menu.Item key="5" icon={<PhoneOutlined />} style={{ margin: '0 20px' }}>
                    <a href="#contacto" style={{ color: 'white' }}>Contacto</a>
                </Menu.Item>
            </Menu>
            <Search
                placeholder="Buscar..."
                onSearch={onSearch}
                style={{ width: 200, marginLeft: '20px', borderRadius: '4px' }}
            />
        </Header>
    );
};

export default BarraNav;
