import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'

export function usePayBills() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) =>
      fetch(API_ROUTES.bills, {
        method: HTTP_METHODS.PUT,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ action: 'payMany', ids }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bills'] })
      qc.invalidateQueries({ queryKey: queryKeys.user() })
    },
  })
}
