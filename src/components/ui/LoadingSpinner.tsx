import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin text-teal-600" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function InlineLoader() {
  return <Loader2 className="h-4 w-4 animate-spin text-teal-600" aria-hidden />;
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-3.5">
          <div className="skeleton h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}