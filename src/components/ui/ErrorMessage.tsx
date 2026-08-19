import { AlertTriangle } from 'lucide-react';
import { ApiError } from '../../types';

interface ErrorMessageProps {
  error: ApiError | null | undefined;
  fallback?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, fallback = 'Something went wrong.', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center">
      <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden />
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