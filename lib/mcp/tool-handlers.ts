import { ExpensesRepository } from '@/lib/db/handlers/expenses.repository'
import { RevenuesRepository } from '@/lib/db/handlers/revenues.repository'
import { EXPENSE_CATEGORIES } from '@/constants/categories'
import type { QueryFilters } from '@/types/server-types'

export interface ToolInput {
  year?: number
  month?: number
  type?: string
  responsible?: string
  description?: string
  minValue?: number
  maxValue?: number
  groupBy?: 'type' | 'responsible'
}

type GroupSummary = { [key: string]: string | number; total: number }

function groupAndSum<T extends Record<string, unknown>>(
  items: T[],
  key: 'type' | 'responsible'
): GroupSummary[] {
  const groups: Record<string, number> = {}
  for (const item of items) {
    const groupKey = String(item[key] ?? 'N/A')
    groups[groupKey] = (groups[groupKey] ?? 0) + (item.value as number)
  }
  return Object.entries(groups)
    .map(([k, total]) => ({ [key]: k, total }))
    .sort((a, b) => b.total - a.total)
}

export async function executeToolCall(
  toolName: string,
  toolInput: ToolInput,
  userId: string,
  currency: string
): Promise<unknown> {
  switch (toolName) {
    case 'query_expenses': {
      const { year, ...rest } = toolInput
      if (!year) throw new Error('year is required')
      const filters: QueryFilters = { year, ...rest }
      const expenses = await new ExpensesRepository().queryWithFilters(userId, currency, filters)
      return expenses.map(({ id, description, type, typeDescription, responsible, value, firstExpirationDate }) => ({
        id, description, type, typeDescription, responsible, value, firstExpirationDate,
      }))
    }

    case 'query_revenues': {
      const { year, ...rest } = toolInput
      if (!year) throw new Error('year is required')
      const filters: QueryFilters = { year, ...rest }
      const revenues = await new RevenuesRepository().queryWithFilters(userId, currency, filters)
      return revenues.map(({ id, description, type, typeDescription, responsible, value, firstExpirationDate }) => ({
        id, description, type, typeDescription, responsible, value, firstExpirationDate,
      }))
    }

    case 'summarize_expenses': {
      const { groupBy, year, month } = toolInput
      if (!groupBy || !year) throw new Error('groupBy and year are required')
      const expenses = await new ExpensesRepository().queryWithFilters(userId, currency, { year, month })
      return groupAndSum(expenses as unknown as Record<string, unknown>[], groupBy)
    }

    case 'get_expense_categories': {
      return EXPENSE_CATEGORIES.map(({ value, label }) => ({ value, label }))
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}
