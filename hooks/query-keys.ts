export const queryKeys = {
  expenses: (month: number, year: number) => ['expenses', month, year] as const,
  revenues: (month: number, year: number) => ['revenues', month, year] as const,
  bills:    ()                            => ['bills'] as const,
  billsDueSoon: (days: number)           => ['bills', 'dueSoon', days] as const,
  fuel:     ()                            => ['fuel'] as const,
  sales:    ()                            => ['sales'] as const,
  chart:    (year: number)               => ['chart', year] as const,
  user:     ()                           => ['user'] as const,
}
