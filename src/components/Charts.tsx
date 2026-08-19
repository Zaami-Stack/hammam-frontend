import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../utils/format';

const palette = ['#0d9488', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6', '#f43f5e', '#84cc16'];

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur">
      {label !== undefined && (
        <p className="mb-1.5 font-display font-bold text-white">{label}</p>
      )}
      {payload.map((entry, index) => (
        <p key={index} className="text-slate-300">
          {entry.name}:{' '}
          <span className="font-semibold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

const axisProps = {
  tick: { fontSize: 11, fill: '#94a3b8' },
  axisLine: false,
  tickLine: false,
} as const;

export function DailyChart({ data }: { data: { day: string; entries: number; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(15,118,110,0.06)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="entries" name="Entries" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart({ data }: { data: { day: string; entries: number; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip
          content={<ChartTooltip />}
          formatter={(value) => formatCurrency(Number(value))}
          cursor={{ stroke: '#0d9488', strokeDasharray: '4 4' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#f59e0b"
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SimplePieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={52}
          outerRadius={86}
          paddingAngle={3}
          strokeWidth={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={palette[index % palette.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-900"
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18 }}
        >
          {total}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-400"
          style={{ fontFamily: 'Inter', fontSize: 11 }}
        >
          entries
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AgentsBarChart({
  data,
}: {
  data: { name: string; entries: number; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e4da" vertical={false} />
        <XAxis dataKey="name" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="entries" name="Entries" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

