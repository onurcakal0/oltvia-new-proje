import axios from 'axios';

// Backend URL'i (Çevre değişkeninden yoksa lokal 8000'i kullanır)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Her giden isteğin arasına girip JWT Token'ı otomatik ekler
api.interceptors.request.use(
  (config) => {
    // Tarayıcı ortamındaysak token'ı al
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('edux_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
