import { useCallback, useState } from 'react';
import { CalendarDays, Filter } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { entriesService } from '../../services/entries.service';
import { usersService } from '../../services/users.service';
import { metaService } from '../../services/prices.service';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { PaginationBar } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Select } from '../../components/ui/Input';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  formatCurrency,
  formatDateTime,
  mondayCasablanca,
  monthCasablanca,
  shiftCasablancaDay,
  todayCasablanca,
  yearCasablanca,
} from '../../utils/format';
import { Entry } from '../../types';
import { cn } from '../../utils/cn';

type PeriodPreset = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year' | 'custom';

const periodPresets: { value: PeriodPreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'this_year', label: 'This year' },
  { value: 'custom', label: 'Custom' },
];

function presetRange(period: PeriodPreset): { from: string; to: string } {
  const today = todayCasablanca();
  switch (period) {
    case 'today':
      return { from: today, to: today };
    case 'yesterday':
      return { from: shiftCasablancaDay(today, -1), to: shiftCasablancaDay(today, -1) };
    case 'this_week':
      return { from: mondayCasablanca(), to: today };
    case 'this_month':
      return { from: `${monthCasablanca()}-01`, to: today };
    case 'this_year':
      return { from: `${yearCasablanca()}-01-01`, to: today };
    case 'custom':
      return { from: '', to: '' };
  }
}

interface Filters {
  page: number;
  limit: number;
  period: PeriodPreset;
  from: string;
  to: string;
  hammamId: string;
  categoryId: string;
  userId: string;
}

const initialFilters: Filters = {
  page: 1,
  limit: 25,
  period: 'today',
  from: presetRange('today').from,
  to: presetRange('today').to,
  hammamId: '',
  categoryId: '',
  userId: '',
};

export function AdminEntriesPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const entries = useAsync(
    useCallback(
      () =>
        entriesService.list({
          page: filters.page,
          limit: filters.limit,
          from: filters.from || undefined,
          to: filters.to || undefined,
          hammamId: filters.hammamId ? Number(filters.hammamId) : undefined,
          categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
          userId: filters.userId ? Number(filters.userId) : undefined,
        }),
      [
        filters.page,
        filters.limit,
        filters.from,
        filters.to,
        filters.hammamId,
        filters.categoryId,
        filters.userId,
      ]
    )
  );

  const meta = useAsync(
    useCallback(() => Promise.all([metaService.hammams(), metaService.categories(), usersService.list({ limit: 100 })]), []),
    []
  );

  const applyFilter = (patch: Partial<Filters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch, page: 1 };
      if (patch.period && patch.period !== 'custom') {
        const range = presetRange(patch.period);
        next.from = range.from;
        next.to = range.to;
      }
      return next;
    });
  };

  const clearFilters = () =>
    setFilters({
      ...initialFilters,
      from: presetRange('today').from,
      to: presetRange('today').to,
    });

  const [hammams, categories, users] = meta.data ?? [[], [], null];

  const columns: Column<Entry>[] = [
    {
      key: 'created_at',
      header: 'Date',
      render: (row) => <span className="whitespace-nowrap">{formatDateTime(row.created_at)}</span>,
    },
    {
      key: 'hammam_name',
      header: 'Hammam',
      render: (row) => <Badge tone={row.hammam_name === 'Men' ? 'blue' : 'violet'}>{row.hammam_name}</Badge>,
    },
    { key: 'category_name', header: 'Category' },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="font-semibold">{formatCurrency(row.price)}</span>,
    },
    { key: 'user_name', header: 'Agent' },
  ];

  const hasFilters =
    filters.period !== 'today' || filters.hammamId || filters.categoryId || filters.userId;

  return (
    <div>
      <PageHeader
        title="Entrance History"
        description="All visitor entrances across the business"
      />

      <Card className="mb-4" padding={false}>
        <div className="flex flex-wrap items-end gap-3 p-4">
          <div className="flex w-full items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" aria-hidden />
            <span className="text-sm font-semibold text-slate-700">Filters</span>
            <div className="ml-2 flex flex-wrap gap-1.5">
              {periodPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => applyFilter({ period: preset.value })}
                  aria-pressed={filters.period === preset.value}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                    filters.period === preset.value
                      ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          {filters.period === 'custom' && (
            <div className="flex items-center gap-2">
              <DateRangePicker
                from={filters.from}
                to={filters.to}
                onFromChange={(from) => applyFilter({ from, period: 'custom' })}
                onToChange={(to) => applyFilter({ to, period: 'custom' })}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-end gap-3 border-t border-slate-100 px-4 py-3">
          <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden />
          <Select
            label="Hammam"
            value={filters.hammamId}
            onChange={(event) => applyFilter({ hammamId: event.target.value })}
            className="w-36"
          >
            <option value="">All</option>
            {(hammams ?? []).map((hammam) => (
              <option key={hammam.id} value={hammam.id}>
                {hammam.name}
              </option>
            ))}
          </Select>
          <Select
            label="Category"
            value={filters.categoryId}
            onChange={(event) => applyFilter({ categoryId: event.target.value })}
            className="w-36"
          >
            <option value="">All</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            label="Agent"
            value={filters.userId}
            onChange={(event) => applyFilter({ userId: event.target.value })}
            className="w-40"
          >
            <option value="">All</option>
            {(users?.data ?? []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="md" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      <Card padding={false}>
        {entries.loading && <LoadingSpinner label="Loading entries..." />}
        {entries.error && <ErrorMessage error={entries.error} onRetry={entries.reload} />}
        {entries.data && (
          <>
            {entries.data.data.length === 0 ? (
              <EmptyState
                title="No entries found"
                description={
                  hasFilters
                    ? 'Try adjusting or clearing the filters to see more results.'
                    : 'Entrances registered by reception agents will appear here.'
                }
              />
            ) : (
              <DataTable columns={columns} rows={entries.data.data} rowKey={(row) => row.id} />
            )}
            <PaginationBar
              pagination={entries.data.pagination}
              onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
            />
          </>
        )}
      </Card>
    </div>
  );
}