import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:9008',
   withCredentials: true, // Important if you rely on cookies for auth!
});

axiosInstance.interceptors.request.use((config) => {
   // If you use JWT tokens stored in localStorage
   const token = localStorage.getItem('jwt');
   if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
   }
   return config;
});

export default axiosInstance;
