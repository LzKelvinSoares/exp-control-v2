import type { UserLevel } from '@/types'

export const USER_LEVELS: UserLevel[] = [
  { level: 1, label: 'Iniciante',    minPoints: 0,   maxPoints: 20 },
  { level: 2, label: 'Aprendiz',     minPoints: 21,  maxPoints: 50 },
  { level: 3, label: 'Intermediário',minPoints: 51,  maxPoints: 100 },
  { level: 4, label: 'Avançado',     minPoints: 101, maxPoints: 200 },
  { level: 5, label: 'Especialista', minPoints: 201, maxPoints: 999 },
]

export const POINTS = {
  BILL_SAVED:       1,
  BILL_PAID_ON_TIME: 2,
  BILL_PAID_LATE:   -1,
} as const
