import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { API_ROUTES } from '@/constants'

export function useUserPoints() {
  return useQuery<{ points: number }>({
    queryKey: queryKeys.user(),
    queryFn: () => fetch(API_ROUTES.user).then((r) => r.json()),
  })
}
