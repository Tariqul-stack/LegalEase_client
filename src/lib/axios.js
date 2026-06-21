import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://legal-ease-server-five.vercel.app',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure we are in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
