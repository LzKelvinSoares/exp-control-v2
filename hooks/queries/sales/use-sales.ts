import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES } from '@/constants'
import type { Sale } from '@/types'

export function useSales() {
  return useQuery<Sale[]>({
    queryKey: queryKeys.sales(),
    queryFn: () => fetch(API_ROUTES.sales).then((r) => r.json()),
  })
}
