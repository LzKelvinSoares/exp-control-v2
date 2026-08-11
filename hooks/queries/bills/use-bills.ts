import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/query-keys'
import { API_ROUTES } from '@/constants'
import type { Bill } from '@/types'

export function useBills() {
  return useQuery<Bill[]>({
    queryKey: queryKeys.bills(),
    queryFn: () => fetch(API_ROUTES.bills).then((r) => r.json()),
  })
}
