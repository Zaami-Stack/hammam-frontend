import { http } from './api';
import { Category, Hammam, PriceRow } from '../types';

async function prices(): Promise<PriceRow[]> {
  const { data } = await http.get<{ success: true; data: PriceRow[] }>('/prices');
  return data.data;
}

async function updatePrice(id: number, price: number): Promise<PriceRow> {
  const { data } = await http.put<{ success: true; data: PriceRow }>(`/prices/${id}`, {
    price,
  });
  return data.data;
}

async function hammams(): Promise<Hammam[]> {
  const { data } = await http.get<{ success: true; data: Hammam[] }>('/hammams');
  return data.data;
}

async function categories(): Promise<Category[]> {
  const { data } = await http.get<{ success: true; data: Category[] }>('/categories');
  return data.data;
}

export const pricesService = { prices, updatePrice };
export const metaService = { hammams, categories };