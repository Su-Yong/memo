import axios from 'axios';
import { refreshUser } from './user';

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

const passURL = ['/users/login', '/users/refresh']; // TOKEN ERROR 무시할 URL
instance.interceptors.response.use((response) => response, async (error) => {
  const url = error.response.config.url;

  if (error.response.data.code === 'AUTH_EXPIRED_TOKEN' && passURL.every((it) => url !== it)) {
    try {
      // console.log('token is expired!');
      const refreshToken = JSON.parse(localStorage.getItem('refresh-token') ?? '');

      // console.log('try to refresh token');
      const newToken = await refreshUser(refreshToken);
      // console.log('get valid token', newToken);
      localStorage.setItem('access-token', JSON.stringify(newToken.accessToken));
      localStorage.setItem('refresh-token', JSON.stringify(newToken.refreshToken));

      // console.log('retry failed request...');
      error.response.config.headers.Authorization = `Bearer ${newToken.accessToken}`;
      error.response = await axios(error.response.config);
      // console.log('change token successfully', error.response);
    } catch (err) {
      console.warn('Failed to refresh token', err);
    }
  }

  return Promise.reject(error);
});

export default instance;
