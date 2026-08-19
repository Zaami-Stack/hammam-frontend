import { http } from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

async function login(credentials: LoginCredentials): Promise<User> {
  const { data } = await http.post<{ success: true; data: User }>(
    '/auth/login',
    credentials
  );
  return data.data;
}

async function logout(): Promise<void> {
  await http.post('/auth/logout');
}

async function me(): Promise<User> {
  const { data } = await http.get<{ success: true; data: User }>('/auth/me');
  return data.data;
}

export const authService = { login, logout, me };