import { GroupSummary, ToolInputGroupBy } from '@/types/server-types';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sumBy<T>(items: T[], key: keyof T): number {
  return items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0)
}

export function buildDateRange(year: number, month?: number): { start: string; end: string } {
  return month
    ? { start: new Date(year, month - 1, 1).toISOString(), end: new Date(year, month, 1).toISOString() }
    : { start: new Date(year, 0, 1).toISOString(), end: new Date(year + 1, 0, 1).toISOString() }
}

export function groupAndSum<T extends Record<string, unknown>>(
  items: T[],
  key: ToolInputGroupBy
): GroupSummary[] {
  const groups: Record<string, number> = {};
  for (const item of items) {
    const groupKey = String(item[key] ?? 'N/A');
    groups[groupKey] = (groups[groupKey] ?? 0) + (item.value as number);
  }
  return Object.entries(groups)
    .map(([k, total]) => ({ [key]: k, total }))
    .sort((a, b) => b.total - a.total);
}