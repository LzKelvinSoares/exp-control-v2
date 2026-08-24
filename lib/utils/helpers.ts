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