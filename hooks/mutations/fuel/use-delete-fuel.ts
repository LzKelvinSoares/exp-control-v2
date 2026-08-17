import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'

export function useDeleteFuel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(API_ROUTES.fuel, {
        method: HTTP_METHODS.DELETE,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ id }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fuel'] }),
  })
}
