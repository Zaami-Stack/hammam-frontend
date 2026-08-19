import { useCallback, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { reportsService } from '../../services/reports.service';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { DailyChart, RevenueChart } from '../../components/Charts';
import { formatCurrency, todayCasablanca, monthCasablanca, yearCasablanca, weekdayLabel } from '../../utils/format';
import { AgentPoint, DashboardSummary } from '../../types';

type Tab = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'agents';

const tabs: { value: Tab; label: string }[] = [
  { value: 'daily', label: 'Jour' },
  { value: 'weekly', label: 'Semaine' },
  { value: 'monthly', label: 'Mois' },
  { value: 'yearly', label: 'Année' },
  { value: 'agents', label: 'Agents' },
];

function SummaryGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MiniStat label="Hommes / Adultes" value={summary.menAdults} tone="text-blue-700" />
      <MiniStat label="Hommes / Enfants" value={summary.menChildren} tone="text-blue-700" />
      <MiniStat label="Femmes / Adultes" value={summary.womenAdults} tone="text-violet-700" />
      <MiniStat label="Femmes / Enfants" value={summary.womenChildren} tone="text-violet-700" />
      <MiniStat label="Total" value={summary.total} tone="text-teal-700" />
      <MiniStat label="Recettes" value={formatCurrency(summary.revenue)} tone="text-amber-700" />
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

const agentColumns: Column<AgentPoint>[] = [
  { key: 'name', header: 'Agent' },
  { key: 'entries', header: 'Entrées' },
  {
    key: 'revenue',
    header: 'Recettes',
    render: (row) => <span className="font-semibold">{formatCurrency(row.revenue)}</span>,
  },
];

export function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>('daily');
  const [date, setDate] = useState(() => todayCasablanca());
  const [month, setMonth] = useState(() => monthCasablanca());
  const [year, setYear] = useState(() => yearCasablanca());
  const [from, setFrom] = useState(() => todayCasablanca());
  const [to, setTo] = useState(() => todayCasablanca());

  const daily = useAsync(() => reportsService.daily(date), [date]);
  const weekly = useAsync(() => reportsService.weekly(date), [date]);
  const monthly = useAsync(() => reportsService.monthly(month), [month]);
  const yearly = useAsync(() => reportsService.yearly(year), [year]);
  const agents = useAsync(() => reportsService.agents(from, to), [from, to]);

  const active = useCallback(() => {
    switch (tab) {
      case 'daily':
        return daily;
      case 'weekly':
        return weekly;
      case 'monthly':
        return monthly;
      case 'yearly':
        return yearly;
      case 'agents':
        return agents;
    }
  }, [tab, daily, weekly, monthly, yearly, agents]);

  const state = active();

  const applied = !!state.data;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Recettes, entrées et performance des agents"
      />

      <div className="-mx-4 mb-4 flex flex-nowrap items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            className={`h-9 shrink-0 rounded-lg border px-4 text-sm font-medium transition-colors ${
              tab === item.value
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        {tab === 'daily' && (
          <div className="flex items-end gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
              />
            </label>
          </div>
        )}
        {tab === 'weekly' && (
          <div className="flex items-end gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500">Fin de semaine (à partir du lundi)</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
              />
            </label>
          </div>
        )}
        {tab === 'monthly' && (
          <div className="flex items-end gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500">Mois</span>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"
              />
            </label>
          </div>
        )}
        {tab === 'yearly' && (
          <div className="flex items-end gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500">Année</span>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-9 w-28 rounded-lg border border-slate-300 bg-white px-2 text-sm"
              />
            </label>
          </div>
        )}
        {tab === 'agents' && (
          <DateRangePicker
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
          />
        )}
      </div>

      {state.loading && <LoadingSpinner label="Chargement du rapport..." />}
      {state.error && <ErrorMessage error={state.error} onRetry={state.reload} />}

      {applied && state.data && (
        <div className="space-y-5">
          {tab === 'daily' && 'entries' in state.data && (
            <>
              <SummaryGrid summary={(state.data as { entries: DashboardSummary }).entries} />
              <Card title="Entrées par agent" subtitle={`Rapport du jour — ${(state.data as { date: string }).date}`}>
                {(state.data as { byAgent: AgentPoint[] }).byAgent.length ? (
                  <DataTable
                    columns={agentColumns}
                    rows={(state.data as { byAgent: AgentPoint[] }).byAgent}
                    rowKey={(row) => row.user_id}
                  />
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">Aucune entrée enregistrée ce jour-là.</p>
                )}
              </Card>
            </>
          )}

          {tab === 'weekly' && 'entries' in state.data && (
            <>
              <SummaryGrid summary={(state.data as { entries: DashboardSummary }).entries} />
              <div className="grid gap-5 lg:grid-cols-2">
                <Card
                  title="Entrées par jour"
                  subtitle={`Semaine du ${(state.data as { weekStart: string }).weekStart} → ${(state.data as { weekEnd: string }).weekEnd}`}
                >
                  <DailyChart data={(state.data as { daily: { day: string; entries: number; revenue: number }[] }).daily.map((point) => ({ ...point, day: weekdayLabel(point.day) }))} />
                </Card>
                <Card title="Recettes par jour">
                  <RevenueChart data={(state.data as { daily: { day: string; entries: number; revenue: number }[] }).daily.map((point) => ({ ...point, day: weekdayLabel(point.day) }))} />
                </Card>
              </div>
            </>
          )}

          {tab === 'monthly' && 'entries' in state.data && (
            <>
              <SummaryGrid summary={(state.data as { entries: DashboardSummary }).entries} />
              <Card title="Performance quotidienne" subtitle={`Rapport mensuel — ${(state.data as { month: string }).month}`}>
                <DailyChart data={(state.data as { daily: { day: string; entries: number; revenue: number }[] }).daily.map((point) => ({ ...point, day: weekdayLabel(point.day) }))} />
              </Card>
              <Card title="Entrées par agent">
                {(state.data as { byAgent: AgentPoint[] }).byAgent.length ? (
                  <DataTable
                    columns={agentColumns}
                    rows={(state.data as { byAgent: AgentPoint[] }).byAgent}
                    rowKey={(row) => row.user_id}
                  />
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">Aucune entrée enregistrée ce mois-ci.</p>
                )}
              </Card>
            </>
          )}

          {tab === 'yearly' && 'entries' in state.data && (
            <>
              <SummaryGrid summary={(state.data as { entries: DashboardSummary }).entries} />
              <Card title="Comparaison mensuelle" subtitle={`Rapport annuel — ${(state.data as { year: string }).year}`}>
                <RevenueChart data={(state.data as { monthly: { label: string; entries: number; revenue: number }[] }).monthly.map((point) => ({ ...point, day: point.label }))} />
              </Card>
            </>
          )}

          {tab === 'agents' && 'rows' in state.data && (
            <Card
              title="Performance des agents"
              subtitle={`du ${(state.data as { from: string }).from} → ${(state.data as { to: string }).to} (30 derniers jours si aucun intervalle)`}
            >
              {(state.data as { rows: AgentPoint[] }).rows.length ? (
                <DataTable
                  columns={agentColumns}
                  rows={(state.data as { rows: AgentPoint[] }).rows}
                  rowKey={(row) => row.user_id}
                />
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">Aucune entrée sur cette période.</p>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}