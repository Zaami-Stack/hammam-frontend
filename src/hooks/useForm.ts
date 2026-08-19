import { useCallback, useState } from 'react';

export function useForm<T extends object>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback((next?: T) => {
    setValues(next ?? initial);
  }, [initial]);

  return { values, setValue, setValues, reset };
}