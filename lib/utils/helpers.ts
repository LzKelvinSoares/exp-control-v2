import { GroupSummary, ToolInputGroupBy } from '@/types/server-types'
import type { DataItem } from '@/types/app-types'
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

export function fromDateInput(s: string): string {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toISOString()
}

function hasSecondaryTableData(content: string): boolean {
  return /\*\*Descrição:\*\*/.test(content) && /\*\*Valor:\*\*\s*R\$/.test(content)
}

export function hasTableData(content: string): boolean {
  const firstMatch = /^\s*\*\s+\*\*\d{2}\/\d{2}\/\d{4}[^*]*\*\*.*R\$/m.test(content)
  if (!firstMatch) {
    const secondMatch = hasSecondaryTableData(content)
    return secondMatch
  }
  return firstMatch
}

export function parseTableData(content: string): DataItem[] {
  // Match pattern: * **DATE:** Description — AMOUNT
  const results: DataItem[] = [];
  if (!hasSecondaryTableData(content)) {
    const regex = /^\s*\*\s+\*\*(\d{2}\/\d{2}\/\d{4}):?\*\*\s*(.+?)\s*—\s*R\$\s*([\d.,]+)/gm
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const date = match[1];
      const description = match[2].trim();
      const amount = match[3];

      results.push({ date, description, amount: `${amount}` });
    }

  } else {
    const descriptionMatch = content.match(/\*\*Descrição:\*\*\s*([^*]+?)(?=\s*\*|\s*$)/);
    const dateMatch = content.match(/\*\*Data:\*\*\s*(\d{2}\/\d{2}\/\d{4})/);
    const amountMatch = content.match(/\*\*Valor:\*\*\s*R\$\s*([\d.,]+)/);

    if (!!descriptionMatch && !!dateMatch && !!amountMatch) {
      const description = descriptionMatch[1].trim();
      const date = dateMatch[1];
      const amount = amountMatch[1];

      results.push({ date, description, amount: `${amount}` })
    }
  }
  return results
}