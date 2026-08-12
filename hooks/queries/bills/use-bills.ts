import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import type { Bill } from '@/types'

export function useBills(month: number, year: number) {
  return useQuery<Bill[]>({
    queryKey: queryKeys.bills(month, year),
    queryFn: () => fetch(API_ROUTES.bills + queryParams.monthYear(month, year)).then((r) => r.json()),
  })
}
