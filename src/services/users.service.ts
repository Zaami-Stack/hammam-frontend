import { http } from './api';
import { Role, User, Paginated } from '../types';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: 'active' | 'inactive';
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: Role;
}

async function list(filters: UserFilters = {}): Promise<Paginated<User>> {
  const { data } = await http.get<Paginated<User>>('/users', { params: filters });
  return data;
}

async function create(input: CreateUserInput): Promise<User> {
  const { data } = await http.post<{ success: true; data: User }>('/users', input);
  return data.data;
}

async function update(id: number, input: UpdateUserInput): Promise<User> {
  const { data } = await http.put<{ success: true; data: User }>(`/users/${id}`, input);
  return data.data;
}

async function setStatus(id: number, isActive: boolean): Promise<User> {
  const { data } = await http.patch<{ success: true; data: User }>(
    `/users/${id}/status`,
    { is_active: isActive }
  );
  return data.data;
}

async function resetPassword(id: number, password: string): Promise<void> {
  await http.patch(`/users/${id}/password`, { password });
}

export const usersService = { list, create, update, setStatus, resetPassword };