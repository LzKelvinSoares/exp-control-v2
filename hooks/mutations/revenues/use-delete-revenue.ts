import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/constants/query-keys'

export function useDeleteRevenue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(API_ROUTES.revenues, {
        method: HTTP_METHODS.DELETE,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.revenues(0, 0).slice(0, 1) }),
  })
}
