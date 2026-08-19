import { useCallback, useMemo, useState } from 'react';
import { todayCasablanca, monthCasablanca, yearCasablanca } from '../utils/format';
import type { DashboardPeriod } from '../types';

export interface PeriodSelection {
  period: DashboardPeriod;
  from: string;
  to: string;
}

export function usePeriodSelection(): {
  selection: PeriodSelection;
  setPeriod: (period: DashboardPeriod) => void;
  setRange: (from: string, to: string) => void;
} {
  const [period, setPeriod] = useState<DashboardPeriod>('today');
  const [from, setFrom] = useState(() => todayCasablanca());
  const [to, setTo] = useState(() => todayCasablanca());

  const setPeriodAndReset = useCallback((next: DashboardPeriod) => {
    setPeriod(next);
    const today = todayCasablanca();
    if (next === 'custom') {
      // keep current from/to
    } else {
      setFrom(today);
      setTo(today);
    }
  }, []);

  const setRange = useCallback((nextFrom: string, nextTo: string) => {
    setPeriod('custom');
    setFrom(nextFrom);
    setTo(nextTo);
  }, []);

  const selection = useMemo<PeriodSelection>(
    () => ({ period, from, to }),
    [period, from, to]
  );

  return { selection, setPeriod: setPeriodAndReset, setRange };
}

export const periodOptions: { value: DashboardPeriod; label: string }[] = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'yesterday', label: 'Hier' },
  { value: 'this_week', label: 'Cette semaine' },
  { value: 'this_month', label: 'Ce mois-ci' },
  { value: 'this_year', label: "Cette année" },
  { value: 'custom', label: 'Personnalisée' },
];

export { todayCasablanca, monthCasablanca, yearCasablanca };