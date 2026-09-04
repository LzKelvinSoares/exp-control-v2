const API_DEFAULT_ROUTE = '/api'

export const API_ROUTES = {
  expenses: `${API_DEFAULT_ROUTE}/expenses`,
  revenues: `${API_DEFAULT_ROUTE}/revenues`,
  bills:    `${API_DEFAULT_ROUTE}/bills`,
  fuel:     `${API_DEFAULT_ROUTE}/fuel`,
  sales:    `${API_DEFAULT_ROUTE}/sales`,
  chart:    `${API_DEFAULT_ROUTE}/chart`,
  user:     `${API_DEFAULT_ROUTE}/user`,
  chat:     `${API_DEFAULT_ROUTE}/chat`,
} as const

export const queryParams = {
  monthYear: (month: number, year: number) => `?month=${month}&year=${year}`,
  year:      (year: number)                => `?year=${year}`,
  dueSoon:   (days: number)               => `?dueSoon=${days}`,
} as const

export const TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';