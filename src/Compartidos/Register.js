import React, { useState } from 'react'; 
import axios from 'axios';
import 'bulma/css/bulma.css'; // Importar Bulma
import { FaCheckCircle } from 'react-icons/fa'; // Importar un ícono para la verificación
import zxcvbn from 'zxcvbn';
import CryptoJS from 'crypto-js'; // Importar CryptoJS para el hash

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

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState(''); // Estado para el error de correo
  const [isPasswordSafe, setIsPasswordSafe] = useState(false); // Estado para controlar si la contraseña es segura
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para mostrar el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
  const [isSuccess, setIsSuccess] = useState(false); // Estado para saber si el mensaje es de éxito
  const [isLoading, setIsLoading] = useState(false); // Estado de carga para verificar la contraseña


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

   
      if (name === 'password') {
        setPasswordError('');
        setIsPasswordSafe(false);
  
        // Evaluar la fortaleza de la contraseña
        const strength = zxcvbn(value).score;
        setPasswordStrength(strength);
      
         // Verificar la fortaleza de la contraseña
      if (strength < 3) {
        setPasswordError('La contraseña debe ser fuerte o muy fuerte');
      } else {
        setPasswordError('');
      }
      }
    };

    

  const checkPasswordSafety = async (password) => {
    setIsLoading(true); // Iniciar la carga
    try {
      // Convertir la contraseña a SHA-1
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);

      // Enviar los primeros 5 caracteres del hash
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      // Comprobar si el hash parcial de la contraseña ha sido filtrado
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
      } else {
        setIsPasswordSafe(true);
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
    }finally {
      setIsLoading(false); // Detener la carga
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si la contraseña es segura
    await checkPasswordSafety(formData.password);

     // Verificar si la contraseña es segura
     await checkPasswordSafety(formData.password);

    // Validar la contraseña antes de proceder
    if (formData.password !== formData.confirmPassword) {
      showModal('Las contraseñas no coinciden', false); // Mostrar modal de error
      return; // Detener el registro si las contraseñas no coinciden
    }

    // Intentar registrar al usuario
    try {
      const response = await axios.post('http://localhost:3001/api/users/register', formData);
      showModal(response.data.message, true); // Mostrar modal de éxito
      showModal('Usuario registrado con éxito', true); // Cambia esta línea
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
      setIsPasswordSafe(false); // Resetear el estado de seguridad de la contraseña
    } catch (error) {
      showModal('Error al registrar el usuario el, correo ya existe ', false); // Mostrar modal de error
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
        return 'red'; // Muy débil / Débil
      case 2:
        return 'yellow'; // Regular
      case 3:
      case 4:
        return 'green'; // Fuerte / Muy fuerte
      default:
        return '';
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ backgroundColor: '#FFFFFF', maxWidth: '800px', width: '100%', borderRadius: '10px', border: '1px solid #dcdcdc' }}>
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
              {emailError && <p className="help is-danger">{emailError}</p>} {/* Mostrar mensaje de error de correo */}
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Contraseña:</label>
              <div className="control">
                <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          {isPasswordSafe && <p><FaCheckCircle style={{ color: 'green' }} /> Contraseña segura</p>}

          <div>
                {/* Barra de progreso personalizada */}
                <div style={{
                  backgroundColor: '#e0e0e0',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  height: '10px',
                }}>
                  <div 
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`, // Calcular el ancho según la fortaleza
                      backgroundColor: getPasswordStrengthColor(),
                      height: '100%',
                    }} 
                  />
                </div>
                {/* Mensaje de carga o estado de la contraseña */}
                <p style={{ color: getPasswordStrengthColor() }}>
                  {isLoading ? 'Verificando contraseña...' : isPasswordSafe ? 'Contraseña segura' : 'Fortaleza: ' + ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][passwordStrength]}
                </p>
              </div>
            </div>
            <div className="field">
              <label className="label" style={{ color: '#000000' }}>Confirmar Contraseña:</label>
              <div className="control">
                <input className="input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ backgroundColor: '#ffffff', color: '#000000' }} />
              </div>
            </div>
            <div className="control">
              <button className="button is-primary" type="submit" style={{ width: '100%' }}>Registrarse</button>
            </div>
          </form>
        </div>
      </div>
{/* Modal para mostrar mensajes */}
{isModalVisible && (
  <div className="modal is-active">
    <div className="modal-background" onClick={closeModal}></div>
    <div className="modal-content" style={{ backgroundColor: isSuccess ? '#d4edda' : '#f8d7da', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
      <p style={{ color: isSuccess ? '#155724' : '#721c24', fontWeight: 'bold', marginBottom: '20px' }}>
        {modalMessage}
      </p>
      <button className="button is-info" onClick={closeModal} style={{ margin: '0 auto' }}>Cerrar</button>
    </div>
    <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
  </div>
)}


    </div>
  );
};

export default Register;
