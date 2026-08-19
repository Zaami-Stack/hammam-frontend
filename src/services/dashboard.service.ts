import { http } from './api';
import { DashboardData, DashboardPeriod } from '../types';

async function dashboard(
  period: DashboardPeriod = 'today',
  from?: string,
  to?: string
): Promise<DashboardData> {
  const params: Record<string, string> = { period };
  if (period === 'custom' && from) params.from = from;
  if (period === 'custom' && to) params.to = to;
  const { data } = await http.get<{ success: true; data: DashboardData }>('/dashboard', {
    params,
  });
  return data.data;
}

export const dashboardService = { dashboard };