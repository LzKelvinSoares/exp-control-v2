import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'
import type { Fuel } from '@/types'

export function useUpdateFuel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Fuel> & { id: string }) =>
      fetch(API_ROUTES.fuel, {
        method: HTTP_METHODS.PUT,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ id, ...data }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fuel'] }),
  })
}
