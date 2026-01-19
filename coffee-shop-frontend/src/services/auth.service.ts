/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const register = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/users/register', data);
  return response.data;
};

export const login = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/users/login', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
