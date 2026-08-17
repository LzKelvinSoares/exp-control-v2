import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { API_ROUTES } from '@/constants'
import { Sale } from '@/types/app-types'

export function useSales() {
  return useQuery<Sale[]>({
    queryKey: queryKeys.sales(),
    queryFn: () => fetch(API_ROUTES.sales).then((r) => r.json()),
  })
}
