const CASABLANCA = 'Africa/Casablanca';

const dateTimeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CASABLANCA,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CASABLANCA,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dayFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: CASABLANCA,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatDateTime(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return dateTimeFmt.format(d).replace(', ', ' ');
}

export function formatTime(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return timeFmt.format(d);
}

export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return dayFmt.format(d);
}

export function formatCurrency(value: number): string {
  return `${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} DH`;
}

export function todayCasablanca(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CASABLANCA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return parts;
}

export function monthCasablanca(): string {
  return todayCasablanca().slice(0, 7);
}

export function yearCasablanca(): string {
  return todayCasablanca().slice(0, 4);
}

const dayPartsFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: CASABLANCA,
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function mondayCasablanca(): string {
  const today = new Date();
  const { weekday } = Object.fromEntries(
    dayPartsFmt.formatToParts(today).map((p) => [p.type, p.value])
  );
  const dayNumber = todayCasablanca();
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday ?? '');
  const offsetDays = (dow <= 0 ? dow + 7 : dow) - 1;
  const t = new Date(`${dayNumber}T12:00:00`);
  t.setUTCDate(t.getUTCDate() - offsetDays);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(
    t.getUTCDate()
  ).padStart(2, '0')}`;
}

export function shiftCasablancaDay(date: string, days: number): string {
  const t = new Date(`${date}T12:00:00`);
  t.setUTCDate(t.getUTCDate() + days);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(
    t.getUTCDate()
  ).padStart(2, '0')}`;
}

export function weekdayLabel(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: CASABLANCA,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}