import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { entriesService } from '../../services/entries.service';
import { metaService, pricesService } from '../../services/prices.service';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import { isApiError } from '../../types';

type Step = 'hammam' | 'category' | 'confirm';

export function NewEntryPage() {
  const toast = useToast();
  const meta = useAsync(
    () => metaService.hammams().then((hammams) => metaService.categories().then((categories) => [hammams, categories] as const)),
    []
  );
  const prices = useAsync(() => pricesService.prices(), []);

  const [hammamId, setHammamId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastEntry, setLastEntry] = useState<string | null>(null);

  const [hammams, categories] = meta.data ?? [[], []];

  const currentPrice = useMemo(() => {
    if (hammamId === null || categoryId === null || !prices.data) return null;
    return prices.data.find(
      (price) => price.hammam_id === hammamId && price.category_id === categoryId
    );
  }, [hammamId, categoryId, prices.data]);

  const step: Step = hammamId === null ? 'hammam' : categoryId === null ? 'category' : 'confirm';

  const canRegister = hammamId !== null && categoryId !== null && currentPrice !== null;

  const reset = () => {
    setHammamId(null);
    setCategoryId(null);
  };

  const register = async () => {
    if (!canRegister || hammamId === null || categoryId === null) return;
    setSubmitting(true);
    try {
      const entry = await entriesService.create({ hammamId, categoryId });
      toast.success(
        `${entry.hammam_name} / ${entry.category_name} registered for ${formatCurrency(entry.price)}`
      );
      setLastEntry(`#${entry.id}`);
      reset();
    } catch (err) {
      toast.error(isApiError(err) ? err.message : 'Unable to register entrance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="New Entrance"
        description="Register a visitor in a few taps. The system sets the price automatically."
      />

      {meta.loading && <LoadingSpinner label="Loading reception setup..." />}
      {meta.error && <ErrorMessage error={meta.error} onRetry={meta.reload} />}

      {meta.data && (
        <div className="space-y-5">
          {lastEntry && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
              Entrance {lastEntry} registered successfully.
              <button type="button" className="ml-auto text-xs font-semibold underline" onClick={() => setLastEntry(null)}>
                Dismiss
              </button>
            </div>
          )}

          <Card title="1. Select the area" subtitle="Where is the visitor entering?">
            <div className="grid grid-cols-2 gap-3">
              {(hammams.filter((h) => h.id <= 2)).map((hammam) => (
                <button
                  key={hammam.id}
                  type="button"
                  onClick={() => setHammamId(hammam.id)}
                  className={cn(
                    'rounded-xl border-2 p-6 text-center transition-all',
                    hammamId === hammam.id
                      ? 'border-teal-600 bg-teal-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-teal-400'
                  )}
                >
                  <span className="block text-3xl" aria-hidden>{hammam.name === 'Men' ? '🔵' : '🟣'}</span>
                  <span className="mt-2 block text-lg font-bold text-slate-900">{hammam.name}</span>
                  <span className="mt-1 block text-sm text-teal-700">
                    {hammam.name === 'Men' ? 'Male area' : 'Female area'}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {step !== 'hammam' && (
            <Card title="2. Select the category">
              <div className="grid grid-cols-2 gap-3">
                {(categories ?? []).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={cn(
                      'rounded-xl border-2 p-6 text-center transition-all',
                      categoryId === category.id
                        ? 'border-teal-600 bg-teal-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-teal-400'
                    )}
                  >
                    <span className="block text-3xl" aria-hidden>{category.name === 'Adult' ? '🧑' : '🧒'}</span>
                    <span className="mt-2 block text-lg font-bold text-slate-900">{category.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {step === 'confirm' && (
            <Card title="3. Confirm">
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="text-4xl font-extrabold text-teal-700">
                    {currentPrice ? formatCurrency(currentPrice.price) : '—'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Set by the system based on current rates
                  </p>
                </div>
                <Button
                  size="xl"
                  fullWidth
                  onClick={register}
                  disabled={!canRegister}
                  loading={submitting}
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
                  Register entrance
                </Button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm text-slate-500 underline-offset-2 hover:underline"
                  disabled={submitting}
                >
                  Change selection
                </button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}