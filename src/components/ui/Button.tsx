import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-teal-600 to-teal-700 text-white shadow-sm shadow-teal-700/25 hover:from-teal-500 hover:to-teal-700 hover:shadow-md hover:shadow-teal-700/30 active:scale-[0.98] focus-visible:outline-teal-600 disabled:from-teal-600 disabled:to-teal-700 disabled:opacity-50 disabled:shadow-none',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] focus-visible:outline-slate-400 disabled:text-slate-400 disabled:hover:bg-white',
  danger:
    'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-600/25 hover:from-red-500 hover:to-red-700 hover:shadow-md hover:shadow-red-600/30 active:scale-[0.98] focus-visible:outline-red-600 disabled:opacity-50 disabled:shadow-none',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] focus-visible:outline-slate-400 disabled:text-slate-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-xl gap-2',
  lg: 'h-11 px-5 text-sm rounded-xl gap-2',
  xl: 'h-14 px-6 text-base rounded-2xl gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth = false, className, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});