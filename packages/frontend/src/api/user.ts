import { User } from '../models/User';
import axios from './config.js';

export const loginUser = async (email: string, password: string): Promise<{
  accessToken: string;
}> => {
  const response = await axios.post('/users/login', { email, password });

  return response.data;
};
