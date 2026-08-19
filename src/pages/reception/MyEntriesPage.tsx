import { useCallback, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { entriesService } from '../../services/entries.service';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { PaginationBar } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDateTime, todayCasablanca } from '../../utils/format';
import { Entry } from '../../types';

export function MyEntriesPage() {
  const [page, setPage] = useState(1);
  const [today] = useState(() => todayCasablanca());

  const entries = useAsync(
    useCallback(() => entriesService.list({ page, limit: 25 }), [page])
  );

  const columns: Column<Entry>[] = [
    {
      key: 'created_at',
      header: 'Date & time',
      render: (row) => <span className="whitespace-nowrap">{formatDateTime(row.created_at)}</span>,
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
        title="My Entries"
        description={`Your registrations for the current business day (${today})`}
      />

      <Card padding={false}>
        {entries.loading && <LoadingSpinner label="Loading your entries..." />}
        {entries.error && <ErrorMessage error={entries.error} onRetry={entries.reload} />}
        {entries.data && (
          <>
            {entries.data.data.length === 0 ? (
              <EmptyState
                title="No entries today"
                description="Entrances you register will appear here."
              />
            ) : (
              <DataTable columns={columns} rows={entries.data.data} rowKey={(row) => row.id} />
            )}
            <PaginationBar pagination={entries.data.pagination} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}