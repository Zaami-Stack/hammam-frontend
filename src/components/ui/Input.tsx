import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.03] placeholder:text-slate-400 transition-all focus:outline-none focus:ring-4',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
            : 'border-slate-200 hover:border-slate-300 focus:border-teal-600 focus:ring-teal-600/15',
          className
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, id, children, ...props },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.03] transition-all hover:border-slate-300 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/15',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
});