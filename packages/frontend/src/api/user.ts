import { UserRequest, UserResponse, UserUpdate } from '@suyong/memo-core';
import axios from './config';

export const loginUser = async (email: string, password: string): Promise<{
  accessToken: string;
  refreshToken: string;
  user: UserRequest;
}> => {
  const response = await axios.post('/users/login', { email, password });

  return response.data;
};
export const refreshUser = async (refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  user: UserRequest;
}> => {
  const response = await axios.post('/users/refresh', { refreshToken });

  return response.data;
};

export const fetchUser = async (email = ''): Promise<UserResponse> => {
  const response = await axios.get(`/users/${email}`);

  return response.data;
};

interface UpdateUser {
  (user: UserUpdate): Promise<UserResponse>;
  (email: string, user: UserUpdate): Promise<UserResponse>;
}
export const updateUser = (async (param1, param2) => {
  if (typeof param1 === 'string') {
    const response = await axios.patch(`/users/${param1}`, param2);

    return response.data;
  }
  const response = await axios.patch(`/users/`, param1);

  return response.data;
}) as UpdateUser;
