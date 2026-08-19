import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  title = 'Rien pour le moment',
  description,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-100 to-sand-200 ring-1 ring-inset ring-slate-900/5">
        <Icon className="h-6 w-6 text-slate-400" aria-hidden />
      </div>
      <p className="font-display text-sm font-bold text-slate-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}