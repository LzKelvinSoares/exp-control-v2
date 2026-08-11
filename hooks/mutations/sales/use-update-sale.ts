import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'
import type { Sale } from '@/types'

export function useUpdateSale() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Sale> & { id: string }) =>
      fetch(API_ROUTES.sales, {
        method: HTTP_METHODS.PUT,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ id, ...data }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sales() }),
  })
}
