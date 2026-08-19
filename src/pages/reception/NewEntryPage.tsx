import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Droplets, Loader2, RefreshCw, UserRound, UserRoundCheck } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { entriesService } from '../../services/entries.service';
import { metaService, pricesService } from '../../services/prices.service';
import { useToast } from '../../hooks/useToast';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatTime, frName } from '../../utils/format';
import { cn } from '../../utils/cn';
import { isApiError, PriceRow } from '../../types';

interface Selection {
  hammamId: number;
  categoryId: number;
  hammamName: string;
  categoryName: string;
  price: number;
}

const PRICE_REFRESH_MS = 60_000;

export function NewEntryPage() {
  const toast = useToast();
  const meta = useAsync(
    () =>
      metaService
        .hammams()
        .then((hammams) =>
          metaService.categories().then((categories) => [hammams, categories] as const)
        ),
    []
  );
  const prices = useAsync(() => pricesService.prices(), []);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastEntry, setLastEntry] = useState<{ id: number; label: string; time: string } | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => prices.reload(), PRICE_REFRESH_MS);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices.reload]);

  const [hammams, categories] = meta.data ?? [[], []];

  const priceFor = useCallback(
    (hammamId: number, categoryId: number): number | null => {
      const row = (prices.data ?? []).find(
        (price) => price.hammam_id === hammamId && price.category_id === categoryId
      );
      return row ? row.price : null;
    },
    [prices.data]
  );

  const price = useMemo(() => {
    if (!selection) return null;
    return priceFor(selection.hammamId, selection.categoryId);
  }, [selection, priceFor]);

  const tiles = useMemo(() => {
    if (!meta.data || !prices.data) return [];
    const rows: {
      hammamId: number;
      hammamName: string;
      categoryId: number;
      categoryName: string;
      price: PriceRow['price'];
    }[] = [];
    for (const hammam of hammams) {
      for (const category of categories) {
        const priceRow = prices.data.find(
          (p) => p.hammam_id === hammam.id && p.category_id === category.id
        );
        if (!priceRow) continue;
        rows.push({
          hammamId: hammam.id,
          hammamName: hammam.name,
          categoryId: category.id,
          categoryName: category.name,
          price: priceRow.price,
        });
      }
    }
    return rows;
  }, [meta.data, prices.data, hammams, categories]);

  const groups: Record<'Men' | 'Women', (typeof tiles)[number][]> = useMemo(() => {
    const men = tiles.filter((t) => t.hammamName === 'Men');
    const women = tiles.filter((t) => t.hammamName === 'Women');
    return { Men: men, Women: women };
  }, [tiles]);

  const isSelected = (hammamId: number, categoryId: number) =>
    !!selection && selection.hammamId === hammamId && selection.categoryId === categoryId;

  const select = (tile: (typeof tiles)[number]) => {
    setSelection({
      hammamId: tile.hammamId,
      categoryId: tile.categoryId,
      hammamName: tile.hammamName,
      categoryName: tile.categoryName,
      price: tile.price,
    });
  };

  const confirmEntry = async () => {
    if (!selection) return;
    setSubmitting(true);
    try {
      const entry = await entriesService.create({ hammamId: selection.hammamId, categoryId: selection.categoryId });
      toast.success(`Entrée n°${entry.id} enregistrée · ${frName(entry.hammam_name)} / ${frName(entry.category_name)} · ${formatCurrency(entry.price)}`);
      setLastEntry({
        id: entry.id,
        label: `${frName(entry.hammam_name)} · ${frName(entry.category_name)} · ${formatCurrency(entry.price)}`,
        time: formatTime(entry.created_at),
      });
      setSelection(null);
    } catch (err) {
      toast.error(isApiError(err) ? err.message : "Impossible d'enregistrer l'entrée");
    } finally {
      setSubmitting(false);
    }
  };

  const loading = meta.loading || (meta.data && prices.loading);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Enregistrer une entrée"
        description="Touchez une catégorie pour enregistrer le visiteur — le tarif actuel est appliqué automatiquement."
      />

      {loading && <LoadingSpinner label="Chargement des options..." />}
      {meta.error && <ErrorMessage error={meta.error} onRetry={meta.reload} />}

      {!loading && !meta.error && (
        <>
          {lastEntry && (
            <div className="animate-fade-up mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-emerald-900">
                  Entrée n°{lastEntry.id} enregistrée
                </p>
                <p className="truncate text-xs text-emerald-700">
                  {lastEntry.label} · {lastEntry.time} — prête pour le prochain visiteur
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLastEntry(null)}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline"
              >
                Fermer
              </button>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-500">
              Les tarifs sont chargés automatiquement et se mettent à jour régulièrement.
            </p>
            <button
              type="button"
              onClick={prices.reload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', prices.loading && 'animate-spin')} aria-hidden />
              Actualiser les tarifs
            </button>
          </div>

          <div className="space-y-8">
            {(['Men', 'Women'] as const).map((name) => {
              const isMen = name === 'Men';
              return (
                <section
                  key={name}
                  className={cn(
                    'rounded-2xl border bg-white p-5 shadow-sm shadow-slate-900/[0.04] sm:p-6',
                    isMen
                      ? 'border-blue-200/80 ring-1 ring-inset ring-blue-100/60'
                      : 'border-violet-200/80 ring-1 ring-inset ring-violet-100/60'
                  )}
                >
                  <header className="mb-4 flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm',
                        isMen
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                          : 'bg-gradient-to-br from-violet-500 to-violet-700'
                      )}
                    >
                      {isMen ? <UserRound className="h-5 w-5" aria-hidden /> : <UserRoundCheck className="h-5 w-5" aria-hidden />}
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900">
                        {isMen ? 'HOMMES' : 'FEMMES'}
                      </h2>
                      <p className="text-xs font-medium text-slate-500">
                        {isMen ? 'Section hommes' : 'Section femmes'}
                      </p>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {groups[name].map((tile) => {
                      const selected = isSelected(tile.hammamId, tile.categoryId);
                      return (
                        <button
                          key={`${tile.hammamId}-${tile.categoryId}`}
                          type="button"
                          onClick={() => select(tile)}
                          disabled={submitting}
                          aria-pressed={selected}
                          className={cn(
                            'group relative flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200',
                            selected
                              ? isMen
                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-200/50'
                                : 'border-violet-500 bg-violet-50 shadow-md shadow-violet-200/50'
                              : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/5',
                            submitting && 'cursor-wait opacity-70'
                          )}
                        >
                          <span>
                            <span className="block text-base font-bold text-slate-900">
                              {frName(tile.categoryName)}
                            </span>
                            <span className="mt-0.5 block text-xs font-medium text-slate-500">
                              {tile.price === null ? 'Tarif indisponible' : formatCurrency(tile.price)}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all',
                              selected
                                ? isMen
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : 'border-violet-500 bg-violet-500 text-white'
                                : 'border-slate-200 text-slate-300 group-hover:border-slate-300'
                            )}
                          >
                            {selected && <CheckCircle2 className="h-5 w-5" aria-hidden />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div
            className={cn(
              'sticky bottom-3 z-10 mt-6 rounded-2xl border bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur transition-all duration-300',
              selection ? 'border-teal-300 opacity-100' : 'pointer-events-none border-slate-200 opacity-0'
            )}
            aria-live="polite"
          >
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-sm">
                  <Droplets aria-hidden className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {selection ? `${frName(selection.hammamName)} · ${frName(selection.categoryName)}` : '…'}
                  </p>
                  <p className="text-xs text-slate-500">Tarif appliqué à l'enregistrement</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <span className="font-display text-2xl font-extrabold text-teal-700">
                  {selection && price !== null ? formatCurrency(price) : '—'}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setSelection(null)} disabled={submitting}>
                    Annuler
                  </Button>
                  <Button size="lg" onClick={confirmEntry} loading={submitting} disabled={!selection || price === null}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                    Confirmer l'entrée
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}