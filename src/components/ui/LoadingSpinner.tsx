import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin text-teal-700" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function InlineLoader() {
  return <Loader2 className="h-4 w-4 animate-spin text-teal-700" aria-hidden />;
}