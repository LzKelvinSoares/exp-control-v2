import type { Currency, CurrencyAccount } from '@/types'

export const CURRENCIES: CurrencyAccount[] = [
  { currency: 'BRL', label: 'Real Brasileiro' },
  { currency: 'EUR', label: 'Euro' },
]

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BRL: 'R$',
  EUR: '€',
}
