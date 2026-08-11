import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import type { Expense } from '@/types'

export function useExpenses(month: number, year: number) {
  return useQuery<Expense[]>({
    queryKey: queryKeys.expenses(month, year),
    queryFn: () => fetch(API_ROUTES.expenses + queryParams.monthYear(month, year)).then((r) => r.json()),
  })
}
