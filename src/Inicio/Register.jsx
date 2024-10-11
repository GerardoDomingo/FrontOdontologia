import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bulma/css/bulma.css';
import { FaCheckCircle, FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa'; // Iconos
import zxcvbn from 'zxcvbn';
import CryptoJS from 'crypto-js';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Detectar el tema del sistema
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkTheme(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'password') {
      setPasswordError('');
      setIsPasswordSafe(false);
      setIsPasswordFiltered(false);

      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);

      if (strength < 3) {
        setPasswordError('La contraseña debe ser fuerte o muy fuerte');
      } else {
        setPasswordError('');
      }

      checkPasswordSafety(value);
    }
  };

  const checkPasswordSafety = async (password) => {
    setIsLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map((line) => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
        setIsPasswordFiltered(true);
      } else {
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false);
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordSafe || passwordStrength < 3) {
      showModal('La contraseña no es segura o es muy débil', false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showModal('Las contraseñas no coinciden', false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/users/register', formData);
      showModal('Usuario registrado correctamente', true);
      setFormData({
        nombre: '',
        aPaterno: '',
        aMaterno: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setIsPasswordSafe(false);
    } catch (error) {
      showModal('Error al registrar el usuario, el correo ya existe', false);
      console.error('Error en el registro:', error);
    }
  };

  const showModal = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return 'red';
      case 2:
        return 'yellow';
      case 3:
      case 4:
        return 'green';
      default:
        return '';
    }
  };

  const themeStyles = {
    backgroundColor: isDarkTheme ? '#1a1a1a' : '#f5f5f5',
    color: isDarkTheme ? '#fff' : '#333',
  };

  return (
    <div
      style={{
        ...themeStyles,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          backgroundColor: isDarkTheme ? '#333' : '#fff',
          maxWidth: '800px',
          width: '100%',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <header
          className="card-header"
          style={{
            backgroundColor: '#00bcd4',
            color: '#ffffff',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            textAlign: 'center',
            padding: '10px',
          }}
        >
          <p className="card-header-title is-centered" style={{ fontSize: '24px' }}>
            <FaUser style={{ marginRight: '10px' }} />
            Registro de Paciente
          </p>
        </header>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            {/* Dividimos el formulario en dos columnas */}
            <div className="columns is-multiline">
              <div className="column is-half">
                <div className="field">
                  <label className="label">Nombre:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Escribe tu nombre completo"
                    />
                    <span className="icon is-left">
                      <FaUser />
                    </span>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="field">
                  <label className="label">Apellido Paterno:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      name="aPaterno"
                      value={formData.aPaterno}
                      onChange={handleChange}
                      required
                      placeholder="Apellido paterno"
                    />
                    <span className="icon is-left">
                      <FaUser />
                    </span>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="field">
                  <label className="label">Apellido Materno:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      name="aMaterno"
                      value={formData.aMaterno}
                      onChange={handleChange}
                      required
                      placeholder="Apellido materno"
                    />
                    <span className="icon is-left">
                      <FaUser />
                    </span>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="field">
                  <label className="label">Teléfono:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="Número de teléfono"
                    />
                    <span className="icon is-left">
                      <FaPhone />
                    </span>
                  </div>
                </div>
              </div>
              <div className="column is-half">
                <div className="field">
                  <label className="label">Email:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Correo electrónico"
                    />
                    <span className="icon is-left">
                      <FaEnvelope />
                    </span>
                  </div>
                  {emailError && <p className="help is-danger">{emailError}</p>}
                </div>
              </div>
              <div className="column is-half">
                <div className="field">
                  <label className="label">Contraseña:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Contraseña segura"
                    />
                    <span className="icon is-left">
                      <FaLock />
                    </span>
                  </div>
                  {passwordError && <p className="help is-danger">{passwordError}</p>}
                  {isPasswordFiltered && (
                    <p className="help is-danger">Contraseña filtrada. Por favor, elige otra.</p>
                  )}
                  {isPasswordSafe && (
                    <p className="help is-success">
                      <FaCheckCircle style={{ color: 'green' }} /> Contraseña segura
                    </p>
                  )}
                  <div
                    style={{
                      backgroundColor: '#e0e0e0',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      height: '10px',
                      marginTop: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                        height: '100%',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color: getPasswordStrengthColor(),
                      fontWeight: 'bold',
                      marginTop: '10px',
                    }}
                  >
                    {isLoading ? 'Verificando contraseña...' : `Fortaleza: ${['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][passwordStrength]}`}
                  </p>
                </div>
              </div>
              <div className="column is-half">
                <div className="field">
                  <label className="label">Confirmar Contraseña:</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirma tu contraseña"
                    />
                    <span className="icon is-left">
                      <FaLock />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="control" style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                className="button is-primary"
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#00bcd4',
                  border: 'none',
                  color: '#fff',
                  padding: '15px',
                  fontSize: '18px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                <FaCheckCircle style={{ marginRight: '10px' }} />
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para mostrar mensajes */}
      {isModalVisible && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div
            className="modal-content"
            style={{
              backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              maxWidth: '400px',
              margin: 'auto',
            }}
          >
            <p
              style={{
                color: isSuccess ? '#155724' : '#721c24',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              {modalMessage}
            </p>
            <button
              className="button is-info"
              onClick={closeModal}
              style={{
                margin: '0 auto',
                backgroundColor: '#007BFF',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
              }}
            >
              Cerrar
            </button>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
        </div>
      )}
    </div>
  );
};

export default Register;
