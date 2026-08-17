import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import { Budget } from '@/types/app-types'

export function useRevenues(month: number, year: number) {
  return useQuery<Budget[]>({
    queryKey: queryKeys.revenues(month, year),
    queryFn: () => fetch(API_ROUTES.revenues + queryParams.monthYear(month, year)).then((r) => r.json()),
  })
}
