export type Role = 'ADMIN' | 'RECEPTION';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface Hammam {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface PriceRow {
  id: number;
  hammam_id: number;
  category_id: number;
  price: number;
  hammam_name: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: number;
  hammam_id: number;
  category_id: number;
  price: number;
  user_id: number;
  created_at: string;
  hammam_name: string;
  category_name: string;
  user_name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export interface DashboardSummary {
  menAdults: number;
  menChildren: number;
  womenAdults: number;
  womenChildren: number;
  total: number;
  revenue: number;
}

export interface DayPoint {
  day: string;
  entries: number;
  revenue: number;
}

export interface AgentPoint {
  user_id: number;
  name: string;
  entries: number;
  revenue: number;
}

export interface DashboardData {
  entries: DashboardSummary;
  revenue: number;
  daily: DayPoint[];
  byAgent: AgentPoint[];
  range: { from: string; to: string };
}

export interface DailyReport {
  date: string;
  entries: DashboardSummary;
  byAgent: AgentPoint[];
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  entries: DashboardSummary;
  daily: DayPoint[];
}

export interface MonthlyReport {
  month: string;
  entries: DashboardSummary;
  daily: DayPoint[];
  byAgent: AgentPoint[];
}

export interface YearlyReport {
  year: string;
  entries: DashboardSummary;
  monthly: { label: string; entries: number; revenue: number }[];
}

export interface AgentsReport {
  from: string;
  to: string;
  rows: AgentPoint[];
}

export type DashboardPeriod =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'this_year'
  | 'custom';

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  status?: number;
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as ApiError).success === false &&
    typeof (value as ApiError).message === 'string'
  );
}