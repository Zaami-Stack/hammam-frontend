import { useState } from 'react';
import { Pencil, Tag } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { pricesService } from '../../services/prices.service';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/format';
import { isApiError, PriceRow } from '../../types';

export function AdminPricesPage() {
  const toast = useToast();
  const prices = useAsync(() => pricesService.prices(), []);
  const [editing, setEditing] = useState<PriceRow | null>(null);

  const columns: Column<PriceRow>[] = [
    {
      key: 'hammam_name',
      header: 'Hammam',
      render: (row) => (
        <Badge tone={row.hammam_name === 'Men' ? 'blue' : 'violet'}>{row.hammam_name}</Badge>
      ),
    },
    { key: 'category_name', header: 'Category' },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="text-lg font-bold text-teal-700">{formatCurrency(row.price)}</span>,
    },
    {
      key: 'actions',
      header: 'Action',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => setEditing(row)}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Price Management"
        description="A price change only affects new entrances."
      />

      <Card padding={false}>
        {prices.loading && <LoadingSpinner label="Loading prices..." />}
        {prices.error && <ErrorMessage error={prices.error} onRetry={prices.reload} />}
        {prices.data && (
          <>
            {prices.data.length === 0 ? (
              <EmptyState
                icon={Tag}
                title="No prices configured"
                description="Prices are required before reception can register entrances."
              />
            ) : (
              <DataTable columns={columns} rows={prices.data} rowKey={(row) => row.id} />
            )}
          </>
        )}
      </Card>

      <p className="mt-4 text-xs text-slate-500">
        Changing a price only affects future entrances. Past entrances keep the price they
        were paid.
      </p>

      <PriceModal
        price={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          toast.success('Price updated — future entrances will use the new rate');
          prices.reload();
        }}
      />
    </div>
  );
}

function PriceModal({
  price,
  onClose,
  onSaved,
}: {
  price: PriceRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset the field whenever the target price changes or the modal opens
  const [key, setKey] = useState<string | null>(null);
  if (price && key !== `${price.id}`) {
    setValue(String(price.price));
    setKey(`${price.id}`);
  }
  if (!price && key !== 'closed') {
    setKey('closed');
  }

  const submit = async () => {
    if (!price) return;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setError('Price must be a positive number');
      return;
    }
    if (parsed > 999999.99) {
      setError('Price is too large');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await pricesService.updatePrice(price.id, parsed);
      onSaved();
    } catch (err) {
      setError(isApiError(err) ? err.message : 'Unable to update price');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={price !== null}
      title={price ? `Edit price — ${price.hammam_name} / ${price.category_name}` : ''}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} loading={submitting}>
            Save price
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Price (DH)"
          type="number"
          min={0}
          step="0.01"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoFocus
        />
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800">
          Current price: {price ? formatCurrency(price.price) : ''} — new entrances only.
        </div>
      </div>
    </Modal>
  );
}