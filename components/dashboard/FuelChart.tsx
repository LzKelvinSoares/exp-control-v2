'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useChart } from '@/hooks/queries/chart/use-chart'
import { useCalendar } from '@/store/calendar'
import { formatCurrency } from '@/lib/utils'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useCurrencySession } from '@/hooks/use-currency-session'

export default function FuelChart() {
  const { year } = useCalendar()
  const { data, isLoading } = useChart(year)
    const { currency } = useCurrencySession()
  const { theme } = useTheme()
  const tickColor = theme === 'dark' ? '#e2e8f0' : '#64748b'

  if (isLoading) return <Skeleton className="h-52 w-full rounded-xl" />

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Combustível — {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barGap={4}>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={60}
              tickFormatter={(v) => formatCurrency(v, currency).replace(/\s/g, '')} />
            <Tooltip formatter={(v) => formatCurrency(Number(v), currency)} />
            <Bar dataKey="fuel" name="Combustível" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
