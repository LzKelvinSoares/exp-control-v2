import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES } from '@/constants'
import type { Fuel } from '@/types'

export function useFuel() {
  return useQuery<Fuel[]>({
    queryKey: queryKeys.fuel(),
    queryFn: () => fetch(API_ROUTES.fuel).then((r) => r.json()),
  })
}
