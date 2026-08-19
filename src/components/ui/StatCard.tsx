import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: 'teal' | 'amber' | 'blue' | 'violet' | 'rose';
}

const tones = {
  teal: 'bg-gradient-to-br from-teal-50 to-teal-100/60 text-teal-700 ring-teal-600/10',
  amber: 'bg-gradient-to-br from-amber-50 to-amber-100/60 text-amber-700 ring-amber-600/10',
  blue: 'bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-700 ring-blue-600/10',
  violet: 'bg-gradient-to-br from-violet-50 to-violet-100/60 text-violet-700 ring-violet-600/10',
  rose: 'bg-gradient-to-br from-rose-50 to-rose-100/60 text-rose-700 ring-rose-600/10',
} as const;

export function StatCard({ label, value, icon: Icon, tone = 'teal' }: StatCardProps) {
  return (
    <div className="card-lift flex items-center gap-3.5 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-900/[0.04]">
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
          tones[tone]
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500">{label}</p>
        <p className="font-display truncate text-xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}