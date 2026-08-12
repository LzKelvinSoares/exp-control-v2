import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'
import type { Fuel } from '@/types'

export function useCreateFuel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<Fuel, 'creationDate' | 'value' | 'valuePerLiter'>) =>
      fetch(API_ROUTES.fuel, {
        method: HTTP_METHODS.POST,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fuel'] }),
  })
}
