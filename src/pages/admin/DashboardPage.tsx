import { useMemo } from 'react';
import {
  CircleDollarSign,
  DoorOpen,
  UserCheck,
  Users as UsersIcon,
} from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { usePeriodSelection, periodOptions } from '../../hooks/usePeriodSelection';
import { dashboardService } from '../../services/dashboard.service';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { DailyChart, RevenueChart, SimplePieChart, AgentsBarChart } from '../../components/Charts';
import { formatCurrency, weekdayLabel } from '../../utils/format';
import { cn } from '../../utils/cn';

export function AdminDashboardPage() {
  const { selection, setPeriod, setRange } = usePeriodSelection();

  const dashboard = useAsync(
    () => dashboardService.dashboard(selection.period, selection.from, selection.to),
    [selection.period, selection.from, selection.to]
  );

  const daily = useMemo(
    () =>
      (dashboard.data?.daily ?? []).map((point) => ({
        ...point,
        day: weekdayLabel(point.day),
      })),
    [dashboard.data]
  );

  const genderData = useMemo(() => {
    const entries = dashboard.data?.entries;
    if (!entries) return [];
    return [
      { name: 'Men', value: entries.menAdults + entries.menChildren },
      { name: 'Women', value: entries.womenAdults + entries.womenChildren },
    ];
  }, [dashboard.data]);

  const categoryData = useMemo(() => {
    const entries = dashboard.data?.entries;
    if (!entries) return [];
    return [
      { name: 'Adults', value: entries.menAdults + entries.womenAdults },
      { name: 'Children', value: entries.menChildren + entries.womenChildren },
    ];
  }, [dashboard.data]);

  const agents = useMemo(
    () =>
      (dashboard.data?.byAgent ?? []).map(({ name, entries, revenue }) => ({
        name,
        entries,
        revenue,
      })),
    [dashboard.data]
  );

  const entries = dashboard.data?.entries;

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description={
          dashboard.data
            ? `Period: ${dashboard.data.range.from} → ${dashboard.data.range.to}`
            : 'Daily overview'
        }
      />

      <div className="-mx-4 mb-5 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setPeriod(option.value)}
            className={cn(
              'h-9 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors',
              selection.period === option.value
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            )}
          >
            {option.label}
          </button>
        ))}
        {selection.period === 'custom' && (
          <DateRangePicker
            from={selection.from}
            to={selection.to}
            onFromChange={(from) => setRange(from, selection.to)}
            onToChange={(to) => setRange(selection.from, to)}
          />
        )}
      </div>

      {dashboard.loading && <LoadingSpinner label="Loading dashboard..." />}
      {dashboard.error && (
        <ErrorMessage error={dashboard.error} onRetry={dashboard.reload} />
      )}

      {dashboard.data && entries && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Entries"
              value={String(entries.total)}
              icon={DoorOpen}
              tone="teal"
            />
            <StatCard
              label="Total Revenue"
              value={formatCurrency(entries.revenue)}
              icon={CircleDollarSign}
              tone="amber"
            />
            <StatCard
              label="Men"
              value={String(entries.menAdults + entries.menChildren)}
              icon={UserCheck}
              tone="blue"
            />
            <StatCard
              label="Women"
              value={String(entries.womenAdults + entries.womenChildren)}
              icon={UsersIcon}
              tone="violet"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card
              title="Daily Entrances"
              subtitle="Entries per day in the period"
              className="lg:col-span-2"
            >
              <DailyChart data={daily} />
            </Card>

            <Card title="Men vs Women" subtitle="Distribution for the period">
              {entries.total > 0 ? (
                <SimplePieChart data={genderData} />
              ) : (
                <p className="py-10 text-center text-sm text-slate-500">No entries in this period.</p>
              )}
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Revenue per Day" className="lg:col-span-2">
              <RevenueChart data={daily} />
            </Card>

            <Card title="Adults vs Children" subtitle="Distribution for the period">
              {entries.total > 0 ? (
                <SimplePieChart data={categoryData} />
              ) : (
                <p className="py-10 text-center text-sm text-slate-500">No entries in this period.</p>
              )}
            </Card>
          </div>

          <Card title="Entries by Agent" subtitle="Performance for the period">
            {agents.length > 0 ? <AgentsBarChart data={agents} /> : <p className="py-10 text-center text-sm text-slate-500">No agent data in this period.</p>}
          </Card>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-medium text-slate-500">Men Adults</p>
              <p className="mt-1 text-2xl font-bold text-teal-700">{entries.menAdults}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-medium text-slate-500">Men Children</p>
              <p className="mt-1 text-2xl font-bold text-teal-700">{entries.menChildren}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-medium text-slate-500">Women Adults</p>
              <p className="mt-1 text-2xl font-bold text-violet-700">{entries.womenAdults}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-medium text-slate-500">Women Children</p>
              <p className="mt-1 text-2xl font-bold text-violet-700">{entries.womenChildren}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}