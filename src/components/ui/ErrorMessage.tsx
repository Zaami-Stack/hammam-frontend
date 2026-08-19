import { AlertTriangle } from 'lucide-react';
import { ApiError } from '../../types';

interface ErrorMessageProps {
  error: ApiError | null | undefined;
  fallback?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, fallback = 'Something went wrong.', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-100 bg-red-50/70 px-4 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden />
      </div>
      <p className="text-sm font-medium text-red-800">{error?.message ?? fallback}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-semibold text-red-700 underline-offset-2 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}