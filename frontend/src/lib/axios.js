import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_MODE === 'development' ? 'http://localhost:9008' : '/',
   withCredentials: true,
});

export default axiosInstance;
