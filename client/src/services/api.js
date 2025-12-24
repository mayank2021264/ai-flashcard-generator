import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Auth API calls
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Flashcard API calls
export const flashcardAPI = {
  getAll: async () => {
    const response = await api.get('/flashcards');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/flashcards/${id}`);
    return response.data;
  },
  
  create: async (flashcardData) => {
    const response = await api.post('/flashcards', flashcardData);
    return response.data;
  },
  
  update: async (id, flashcardData) => {
    const response = await api.put(`/flashcards/${id}`, flashcardData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/flashcards/${id}`);
    return response.data;
  },
  
  search: async (query) => {
    const response = await api.get(`/flashcards/search?q=${query}`);
    return response.data;
  },
};

// AI API calls
export const aiAPI = {
  generateFromText: async (data) => {
    const response = await api.post('/ai/generate-from-text', data);
    return response.data;
  },
  
  generateFromPDF: async (formData) => {
    const response = await api.post('/ai/generate-from-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;