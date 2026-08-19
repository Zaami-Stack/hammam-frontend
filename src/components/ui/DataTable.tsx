import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({ columns, rows, rowKey, emptyTitle, emptyDescription }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn('px-5 py-3 font-semibold', column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-slate-50 transition-colors last:border-0 hover:bg-teal-50/40"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-5 py-3.5 text-slate-600', column.className)}
                >
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          {emptyTitle ?? 'No results found.'}
          {emptyDescription && <span className="block text-xs text-slate-400">{emptyDescription}</span>}
        </div>
      )}
    </div>
  );
}