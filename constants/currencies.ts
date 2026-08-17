import { Currency, CurrencyAccount } from '@/types/app-types'

export const CURRENCIES: CurrencyAccount[] = [
  { currency: 'BRL', label: 'Real Brasileiro' },
  { currency: 'EUR', label: 'Euro' },
]

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BRL: 'R$',
  EUR: '€',
}
