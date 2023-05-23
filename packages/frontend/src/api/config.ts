import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem('access-token') ?? '');
    config.headers.Authorization = `Bearer ${token}`;
  } catch {}

  return config;
});

export default instance;
