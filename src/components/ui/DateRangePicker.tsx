interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromMax?: string;
  toMin?: string;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  fromMax,
  toMin,
}: DateRangePickerProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">From</span>
        <input
          type="date"
          value={from}
          max={fromMax}
          onChange={(event) => onFromChange(event.target.value)}
          className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
          aria-label="From date"
        />
      </div>
      <span className="pb-2 text-slate-400">–</span>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">To</span>
        <input
          type="date"
          value={to}
          min={toMin}
          onChange={(event) => onToChange(event.target.value)}
          className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
          aria-label="To date"
        />
      </div>
    </div>
  );
}