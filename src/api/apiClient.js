import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setApiBaseUrl = (url) => {
  if (url) {
    apiClient.defaults.baseURL = url;
  }
};

export const loadConfig = async () => {
  try {
    const res = await fetch('/config.json');
    if (res.ok) {
      const data = await res.json();
      setApiBaseUrl(data.apiUrl);
      return data;
    }
  } catch (error) {
    console.warn('No se pudo cargar config.json, usando fallback .env:', error);
  }
  return {
    apiUrl: API_BASE_URL,
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
  };
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);