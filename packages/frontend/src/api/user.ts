import { User } from '../models/User';
import axios from './config.js';

export const loginUser = async (email: string, password: string): Promise<{
  accessToken: string;
  user: User;
}> => {
  const response = await axios.post('/users/login', { email, password });

  return response.data;
};

export const fetchUser = async (email = ''): Promise<User> => {
  const response = await axios.get(`/users/${email}`);

  return response.data;
};

interface UpdateUser {
  (user: Partial<User>): Promise<User>;
  (email: string, user: Partial<User>): Promise<User>;
}
export const updateUser = (async (param1, param2) => {
  if (typeof param1 === 'string') {
    const response = await axios.patch(`/users/${param1}`, param2);

    return response.data;
  }
  const response = await axios.patch(`/users/`, param1);

  return response.data;
}) as UpdateUser;
