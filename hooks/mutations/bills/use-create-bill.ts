import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'
import type { Bill } from '@/types'

export function useCreateBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Bill>) =>
      fetch(API_ROUTES.bills, {
        method: HTTP_METHODS.POST,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.bills() }),
  })
}
