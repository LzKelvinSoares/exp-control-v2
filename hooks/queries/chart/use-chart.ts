import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { API_ROUTES, queryParams } from '@/constants'
import { MonthlyChartData } from '@/types/app-types'

export function useChart(year: number) {
  return useQuery<MonthlyChartData[]>({
    queryKey: queryKeys.chart(year),
    queryFn: () => fetch(API_ROUTES.chart + queryParams.year(year)).then((r) => r.json()),
  })
}
