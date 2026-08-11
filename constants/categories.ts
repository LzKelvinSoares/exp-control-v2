import type { CategoryOption, ExpenseCategory, RevenueCategory, BillCategory } from '@/types'

export const EXPENSE_CATEGORIES: CategoryOption<ExpenseCategory>[] = [
  { value: 'CARTAO',      label: 'Cartão de Crédito' },
  { value: 'COMPRAS',     label: 'Compras' },
  { value: 'ENERGIA',     label: 'Energia' },
  { value: 'AGUA',        label: 'Água' },
  { value: 'GAS',         label: 'Gás' },
  { value: 'INTERNET',    label: 'Internet' },
  { value: 'TELEFONE',    label: 'Telefone' },
  { value: 'ALUGUEL',     label: 'Aluguel' },
  { value: 'COMBUSTIVEL', label: 'Combustível' },
  { value: 'OUTROS',      label: 'Outros' },
]

export const REVENUE_CATEGORIES: CategoryOption<RevenueCategory>[] = [
  { value: 'SALARIO',      label: 'Salário' },
  { value: 'FREELANCE',    label: 'Freelance' },
  { value: 'INVESTIMENTO', label: 'Investimento' },
  { value: 'EMPRESTIMO',   label: 'Empréstimo' },
  { value: 'OUTROS',       label: 'Outros' },
]

export const BILL_CATEGORIES: CategoryOption<BillCategory>[] = [
  { value: 'ENERGIA',  label: 'Energia' },
  { value: 'AGUA',     label: 'Água' },
  { value: 'GAS',      label: 'Gás' },
  { value: 'INTERNET', label: 'Internet' },
  { value: 'TELEFONE', label: 'Telefone' },
  { value: 'ALUGUEL',  label: 'Aluguel' },
  { value: 'OUTROS',   label: 'Outros' },
]
