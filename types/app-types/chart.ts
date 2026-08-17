export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface MonthlyChartData {
  month: string
  expenses: number
  revenues: number
  fuel: number
}
