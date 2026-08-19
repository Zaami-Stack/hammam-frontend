import { useState } from 'react';
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
import { formatCurrency, formatDateTime, frName, todayCasablanca } from '../../utils/format';
import { Entry } from '../../types';

export function MyEntriesPage() {
  const [page, setPage] = useState(1);
  const [today] = useState(() => todayCasablanca());

  const entries = useAsync(() => entriesService.list({ page, limit: 25 }), [page]);

  const columns: Column<Entry>[] = [
    {
      key: 'created_at',
      header: 'Date et heure',
      render: (row) => <span className="whitespace-nowrap">{formatDateTime(row.created_at)}</span>,
    },
    {
      key: 'hammam_name',
      header: 'Secteur',
      render: (row) => <Badge tone={row.hammam_name === 'Men' ? 'blue' : 'violet'}>{frName(row.hammam_name)}</Badge>,
    },
    { key: 'category_name', header: 'Catégorie' },
    {
      key: 'price',
      header: 'Prix',
      render: (row) => <span className="font-semibold">{formatCurrency(row.price)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Mes entrées"
        description={`Vos enregistrements du jour (${today})`}
      />

      <Card padding={false}>
        {entries.loading && <LoadingSpinner label="Chargement de vos entrées..." />}
        {entries.error && <ErrorMessage error={entries.error} onRetry={entries.reload} />}
        {entries.data && (
          <>
            {entries.data.data.length === 0 ? (
              <EmptyState
                title="Aucune entrée aujourd'hui"
                description="Les entrées que vous enregistrez apparaîtront ici."
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