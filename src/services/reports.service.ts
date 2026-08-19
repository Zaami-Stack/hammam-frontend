import { http } from './api';
import {
  AgentsReport,
  DailyReport,
  MonthlyReport,
  WeeklyReport,
  YearlyReport,
} from '../types';

async function daily(date?: string): Promise<DailyReport> {
  const { data } = await http.get<{ success: true; data: DailyReport }>('/reports/daily', {
    params: date ? { date } : {},
  });
  return data.data;
}

async function weekly(date?: string): Promise<WeeklyReport> {
  const { data } = await http.get<{ success: true; data: WeeklyReport }>('/reports/weekly', {
    params: date ? { date } : {},
  });
  return data.data;
}

async function monthly(month?: string): Promise<MonthlyReport> {
  const { data } = await http.get<{ success: true; data: MonthlyReport }>('/reports/monthly', {
    params: month ? { month } : {},
  });
  return data.data;
}

async function yearly(year?: string): Promise<YearlyReport> {
  const { data } = await http.get<{ success: true; data: YearlyReport }>('/reports/yearly', {
    params: year ? { year } : {},
  });
  return data.data;
}

async function agents(from?: string, to?: string): Promise<AgentsReport> {
  const { data } = await http.get<{ success: true; data: AgentsReport }>('/reports/agents', {
    params: from && to ? { from, to } : {},
  });
  return data.data;
}

export const reportsService = { daily, weekly, monthly, yearly, agents };