import { format, getISOWeek, getISOWeekYear, startOfDay } from 'date-fns';

export function toDateKey(date = new Date()) { return format(date, 'yyyy-MM-dd'); }
export function toWeekKey(date = new Date()) { return `${getISOWeekYear(date)}-W${String(getISOWeek(date)).padStart(2, '0')}`; }
export function localDayStart(value: string | Date) { return startOfDay(typeof value === 'string' ? new Date(`${value}T12:00:00`) : value); }
export function weekdayIndex(date = new Date()) { return date.getDay(); }
