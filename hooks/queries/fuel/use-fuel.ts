import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import type { Fuel } from '@/types'

export function useFuel(month: number, year: number) {
  return useQuery<Fuel[]>({
    queryKey: queryKeys.fuel(month, year),
    queryFn: () => fetch(API_ROUTES.fuel + queryParams.monthYear(month, year)).then((r) => r.json()),
  })
}
