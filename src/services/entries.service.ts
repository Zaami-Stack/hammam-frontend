import { http } from './api';
import { Entry, Paginated } from '../types';

export interface EntryFilters {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  hammamId?: number;
  categoryId?: number;
  userId?: number;
}

export interface CreateEntryInput {
  hammamId: number;
  categoryId: number;
}

async function list(filters: EntryFilters = {}): Promise<Paginated<Entry>> {
  const { data } = await http.get<Paginated<Entry>>('/entries', { params: filters });
  return data;
}

async function create(input: CreateEntryInput): Promise<Entry> {
  const { data } = await http.post<{ success: true; data: Entry }>('/entries', input);
  return data.data;
}

export const entriesService = { list, create };