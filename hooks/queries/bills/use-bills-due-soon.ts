import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import { Bill } from '@/types/app-types'

export function useBillsDueSoon(days = 5) {
  return useQuery<Bill[]>({
    queryKey: queryKeys.billsDueSoon(days),
    queryFn: () => fetch(API_ROUTES.bills + queryParams.dueSoon(days)).then((r) => r.json()),
  })
}
