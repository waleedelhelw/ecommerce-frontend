import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://waleedecommerceapi.runasp.net/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ Request Interceptor - إضافة التوكن ============
API.interceptors.request.use(
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

// ============ Response Interceptor - التعامل مع الأخطاء ============
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 429) {
        toast.error('تم تجاوز الحد المسموح من الطلبات، حاول بعد دقيقة');
      }

      if (status === 401) {
        const token = localStorage.getItem('token');

        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();

            if (isExpired) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;