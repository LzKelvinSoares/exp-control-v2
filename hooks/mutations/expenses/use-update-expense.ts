import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_ROUTES, HTTP_METHODS, HTTP_HEADERS } from '@/constants'
import { queryKeys } from '@/hooks/query-keys'
import type { Expense } from '@/types'

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Expense> & { id: string }) =>
      fetch(API_ROUTES.expenses, {
        method: HTTP_METHODS.PUT,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ id, ...data }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.expenses(0, 0).slice(0, 1) }),
  })
}
