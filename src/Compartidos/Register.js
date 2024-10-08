import React, { useState } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.css'; // Importar Bulma

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '', // Campo para confirmar contraseña
  });

  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Resetear error de contraseña cuando el usuario cambia la contraseña
    if (name === 'password') {
      setPasswordError('');
    }
  };

  const checkPasswordSafety = async (password) => {
    try {
      const hashedPassword = password.toLowerCase();
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${hashedPassword.slice(0, 5)}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      // Comprobar si la contraseña ha sido expuesta
      if (hashes.includes(hashedPassword.slice(5))) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si la contraseña es segura
    await checkPasswordSafety(formData.password);

    // Solo continuar si no hay errores de contraseña
    if (!passwordError && formData.password === formData.confirmPassword) {
      try {
        const response = await axios.post('http://localhost:3001/api/users/register', formData);
        alert(response.data); // Mostrar mensaje de éxito
        // Limpiar el formulario
        setFormData({
          nombre: '',
          aPaterno: '',
          aMaterno: '',
          telefono: '',
          email: '',
          password: '',
          confirmPassword: '', // Limpiar el campo de confirmar contraseña
        });
      } catch (error) {
        alert('Error al registrar el usuario');
        console.error('Error en el registro:', error);
      }
    } else if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
<div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ backgroundColor: '#FFFFFF',maxWidth: '800px', width: '100%', borderRadius: '10px', border: '1px solid #dcdcdc' }}>

        <header className="card-header" style={{ backgroundColor: '#00bcd4', color: '#ffffff', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
          <p className="card-header-title has-text-centered">Registro de Paciente</p>
        </header>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Nombre:</label>
              <div className="control">
                <input className="input" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Apellido Paterno:</label>
              <div className="control">
                <input className="input" type="text" name="aPaterno" value={formData.aPaterno} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Apellido Materno:</label>
              <div className="control">
                <input className="input" type="text" name="aMaterno" value={formData.aMaterno} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Teléfono:</label>
              <div className="control">
                <input className="input" type="text" name="telefono" value={formData.telefono} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Email:</label>
              <div className="control">
                <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Contraseña:</label>
              <div className="control">
                <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
              {passwordError && <p className="help is-danger">{passwordError}</p>}
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Confirmar Contraseña:</label>
              <div className="control">
                <input className="input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <button type="submit" className="button is-primary is-fullwidth">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
