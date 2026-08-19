import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: Toast['type'], message: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-3), { id, type, message }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const success = useCallback((message: string) => push('success', message), [push]);
  const error = useCallback((message: string) => push('error', message), [push]);

  const value = useMemo(() => ({ success, error }), [success, error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="animate-fade-up pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-white/95 px-3.5 py-3 text-sm font-medium shadow-xl shadow-slate-950/10 backdrop-blur"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
            )}
            <span className="flex-1 text-slate-700">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}