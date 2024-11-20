import axios from 'axios';

const API_URL = 'https://backendodontologia.onrender.com/api/users';

// Iniciar sesión
export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
};

// Verificar si el usuario está autenticado
export const checkAuth = async () => {
  return axios.get(`${API_URL}/checkAuth`, { withCredentials: true });
};

// Cerrar sesión
export const logoutUser = async () => {
  return axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};
