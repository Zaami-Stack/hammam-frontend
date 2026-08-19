import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen, PlusCircle } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { dashboardService } from '../../services/dashboard.service';
import { entriesService } from '../../services/entries.service';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatTime, todayCasablanca } from '../../utils/format';
import { Entry } from '../../types';

export function ReceptionDashboardPage() {
  const [today] = useState(() => todayCasablanca());

  const stats = useAsync(() => dashboardService.dashboard('today'), []);
  const entries = useAsync(() => entriesService.list({ page: 1, limit: 10 }), []);

  const columns: Column<Entry>[] = [
    {
      key: 'created_at',
      header: 'Time',
      render: (row) => <span className="font-medium">{formatTime(row.created_at)}</span>,
    },
    {
      key: 'hammam_name',
      header: 'Area',
      render: (row) => <Badge tone={row.hammam_name === 'Men' ? 'blue' : 'violet'}>{row.hammam_name}</Badge>,
    },
    { key: 'category_name', header: 'Category' },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="font-semibold">{formatCurrency(row.price)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Today at the hammam"
        description={`Business day: ${today}`}
        actions={
          <Link to="/reception/new-entry">
            <Button>
              <PlusCircle className="h-4 w-4" /> New entrance
            </Button>
          </Link>
        }
      />

      {stats.loading && <LoadingSpinner label="Loading today's statistics..." />}
      {stats.error && <ErrorMessage error={stats.error} onRetry={stats.reload} />}

      {stats.data && (
        <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="My entries today" value={String(stats.data.entries.total)} icon={DoorOpen} tone="teal" />
          <StatCard label="Revenue today" value={formatCurrency(stats.data.entries.revenue)} icon={DoorOpen} tone="amber" />
          <StatCard label="Men" value={String(stats.data.entries.menAdults + stats.data.entries.menChildren)} icon={DoorOpen} tone="blue" />
          <StatCard label="Women" value={String(stats.data.entries.womenAdults + stats.data.entries.womenChildren)} icon={DoorOpen} tone="violet" />
        </div>
      )}

      <Card title="My latest entries" subtitle="Your registrations for today">
        {entries.loading && <LoadingSpinner label="Loading your entries..." />}
        {entries.error && <ErrorMessage error={entries.error} onRetry={entries.reload} />}
        {entries.data && (
          <>
            {entries.data.data.length === 0 ? (
              <EmptyState
                title="No entries yet today"
                description="Register the first entrance of the day with the New entrance button."
              />
            ) : (
              <DataTable columns={columns} rows={entries.data.data} rowKey={(row) => row.id} />
            )}
            {entries.data.pagination.total > entries.data.pagination.limit && (
              <div className="border-t border-slate-100 pt-3 text-right">
                <Link
                  to="/reception/my-entries"
                  className="text-sm font-semibold text-teal-700 hover:underline"
                >
                  View all my entries →
                </Link>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}