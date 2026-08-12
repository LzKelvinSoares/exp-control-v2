export const queryKeys = {
  expenses: (month: number, year: number) => ['expenses', month, year] as const,
  revenues: (month: number, year: number) => ['revenues', month, year] as const,
  bills:    (month: number, year: number) => ['bills', month, year] as const,
  billsDueSoon: (days: number)           => ['bills', 'dueSoon', days] as const,
  fuel:     (month: number, year: number) => ['fuel', month, year] as const,
  sales:    ()                            => ['sales'] as const,
  chart:    (year: number)               => ['chart', year] as const,
  user:     ()                           => ['user'] as const,
}
