export const API_ROUTES = {
  expenses: '/api/expenses',
  revenues: '/api/revenues',
  bills:    '/api/bills',
  fuel:     '/api/fuel',
  sales:    '/api/sales',
  chart:    '/api/chart',
  user:     '/api/user',
} as const

export const queryParams = {
  monthYear: (month: number, year: number) => `?month=${month}&year=${year}`,
  year:      (year: number)                => `?year=${year}`,
  dueSoon:   (days: number)               => `?dueSoon=${days}`,
} as const

export const TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';