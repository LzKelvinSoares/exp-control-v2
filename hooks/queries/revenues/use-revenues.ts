import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import type { Revenue } from '@/types'

export function useRevenues(month: number, year: number) {
  return useQuery<Revenue[]>({
    queryKey: queryKeys.revenues(month, year),
    queryFn: () => fetch(API_ROUTES.revenues + queryParams.monthYear(month, year)).then((r) => r.json()),
  })
}
