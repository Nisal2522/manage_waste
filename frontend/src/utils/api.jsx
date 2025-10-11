import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

// User API
export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Bin API
export const getBins = async (params = {}) => {
  const response = await api.get('/bins', { params });
  return response.data;
};

export const getBinById = async (id) => {
  const response = await api.get(`/bins/${id}`);
  return response.data;
};

export const createBin = async (binData) => {
  const response = await api.post('/bins', binData);
  return response.data;
};

export const updateBin = async (id, binData) => {
  const response = await api.put(`/bins/${id}`, binData);
  return response.data;
};

export const deleteBin = async (id) => {
  const response = await api.delete(`/bins/${id}`);
  return response.data;
};

export const getBinsByLocation = async (lat, lng, radius = 1000) => {
  const response = await api.get(`/bins/location?lat=${lat}&lng=${lng}&radius=${radius}`);
  return response.data;
};

// Route API
export const getRoutes = async (params = {}) => {
  const response = await api.get('/routes', { params });
  return response.data;
};

export const getRouteById = async (id) => {
  const response = await api.get(`/routes/${id}`);
  return response.data;
};

export const createRoute = async (routeData) => {
  const response = await api.post('/routes', routeData);
  return response.data;
};

export const updateRoute = async (id, routeData) => {
  const response = await api.put(`/routes/${id}`, routeData);
  return response.data;
};

export const deleteRoute = async (id) => {
  const response = await api.delete(`/routes/${id}`);
  return response.data;
};

export const optimizeRoute = async (routeId) => {
  const response = await api.post(`/routes/${routeId}/optimize`);
  return response.data;
};

// Collection API
export const getCollections = async (params = {}) => {
  const response = await api.get('/collections', { params });
  return response.data;
};

export const getCollectionById = async (id) => {
  const response = await api.get(`/collections/${id}`);
  return response.data;
};

export const createCollection = async (collectionData) => {
  const response = await api.post('/collections', collectionData);
  return response.data;
};

export const updateCollection = async (id, collectionData) => {
  const response = await api.put(`/collections/${id}`, collectionData);
  return response.data;
};

export const deleteCollection = async (id) => {
  const response = await api.delete(`/collections/${id}`);
  return response.data;
};

export const scanQRCode = async (qrData) => {
  const response = await api.post('/collections/scan', { qrData });
  return response.data;
};

export const getCollectionsByDate = async (date) => {
  const response = await api.get(`/collections/date/${date}`);
  return response.data;
};

// Analytics API
export const getAnalytics = async (params = {}) => {
  const response = await api.get('/analytics', { params });
  return response.data;
};

export const getCollectionStats = async (params = {}) => {
  const response = await api.get('/analytics/collections', { params });
  return response.data;
};

export const getRouteStats = async (params = {}) => {
  const response = await api.get('/analytics/routes', { params });
  return response.data;
};

export const getBinStats = async (params = {}) => {
  const response = await api.get('/analytics/bins', { params });
  return response.data;
};

// File upload API
export const uploadFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// QR Code API
export const generateQRCode = async (data) => {
  const response = await api.post('/qr/generate', { data });
  return response.data;
};

export const validateQRCode = async (qrData) => {
  const response = await api.post('/qr/validate', { qrData });
  return response.data;
};

export default api;
