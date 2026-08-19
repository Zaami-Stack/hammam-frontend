import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ title, subtitle, actions, children, className, padding = true }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-900/[0.04]',
        className
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
          <div>
            <h2 className="font-display text-sm font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn(padding && 'p-5')}>{children}</div>
    </section>
  );
}