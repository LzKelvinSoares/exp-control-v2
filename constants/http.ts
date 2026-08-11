export const HTTP_METHODS = {
  GET:    'GET',
  POST:   'POST',
  PUT:    'PUT',
  DELETE: 'DELETE',
} as const

export const HTTP_HEADERS = {
  JSON: { 'Content-Type': 'application/json' } as const,
} as const
