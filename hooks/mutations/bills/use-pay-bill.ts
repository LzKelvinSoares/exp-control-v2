import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/constants/query-keys'

export function usePayBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(API_ROUTES.bills, {
        method: HTTP_METHODS.PUT,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ id, action: 'pay' }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bills'] })
      qc.invalidateQueries({ queryKey: queryKeys.user() })
    },
  })
}
