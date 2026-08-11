import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'
import type { Revenue } from '@/types'

export function useCreateRevenue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Revenue>) =>
      fetch(API_ROUTES.revenues, {
        method: HTTP_METHODS.POST,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.revenues(0, 0).slice(0, 1) }),
  })
}
