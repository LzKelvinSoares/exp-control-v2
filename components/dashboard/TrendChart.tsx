'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useChart } from '@/hooks/queries/chart/use-chart'
import { useCalendar } from '@/store/calendar'
import { formatCurrency } from '@/lib/utils'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useCurrencySession } from '@/hooks/use-currency-session'

export default function TrendChart() {
  const { year } = useCalendar()
  const { data, isLoading } = useChart(year)
    const { currency } = useCurrencySession()
  const { theme } = useTheme()
  const tickColor = theme === 'dark' ? '#e2e8f0' : '#64748b'

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Despesas vs Receitas — {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barGap={4}>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} width={60}
              tickFormatter={(v) => formatCurrency(v, currency).replace(/\s/g, '')} />
            <Tooltip formatter={(v) => formatCurrency(Number(v), currency)} />
            <Legend iconType="circle" iconSize={8} />
            <Bar dataKey="expenses" name="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenues" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
