import React, { ReactNode, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/(dashboard)/page'

vi.mock('@/hooks/queries/expenses/use-expenses', () => ({
  useExpenses: vi.fn(),
}))

vi.mock('@/hooks/queries/revenues/use-revenues', () => ({
  useRevenues: vi.fn(),
}))

vi.mock('@/hooks/queries/fuel/use-fuel', () => ({
  useFuel: vi.fn(),
}))

vi.mock('@/hooks/use-currency-session', () => ({
  useCurrencySession: vi.fn(() => ({ currency: 'BRL' })),
}))

vi.mock('@/store/calendar', () => ({
  useCalendar: vi.fn(() => ({ month: 1, year: 2025 })),
}))

vi.mock('@/components/shared/PageWrapper', () => ({
  PageWrapper: ({ title, children }: { title: string; children?: ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

vi.mock('@/components/shared/SummaryCard', () => ({
  default: function SummaryCardMock({
    label,
    value,
    breakdown,
  }: {
    label: string
    value: string
    breakdown?: Array<{ label: string; value: string }>
  }) {
    const [open, setOpen] = useState(false)

    return (
      <div>
        <div>{label}</div>
        <div>{value}</div>
        {breakdown && breakdown.length > 0 && (
          <button aria-label='Ver detalhes' onClick={() => setOpen((prev) => !prev)}>
            Toggle
          </button>
        )}
        {open && breakdown && breakdown.map((item) => <div key={item.label}>{item.label}</div>)}
      </div>
    )
  },
}))

vi.mock('@/components/dashboard/BillsDueSoon', () => ({
  default: () => <div>BillsDueSoon</div>,
}))

vi.mock('@/components/dashboard/TrendChart', () => ({
  default: () => <div>TrendChart</div>,
}))

vi.mock('@/components/dashboard/FuelChart', () => ({
  default: () => <div>FuelChart</div>,
}))

import { useExpenses } from '@/hooks/queries/expenses/use-expenses'
import { useFuel } from '@/hooks/queries/fuel/use-fuel'
import { useRevenues } from '@/hooks/queries/revenues/use-revenues'
import { Budget, Expense, Fuel } from '@/types/app-types'
import { UseQueryResult } from '@tanstack/react-query'

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useExpenses).mockReturnValue({ data: [{ value: 120, type: 'COMPRAS' }], isLoading: false } as UseQueryResult<NoInfer<Expense[]>>)
    vi.mocked(useRevenues).mockReturnValue({ data: [{ value: 300, type: 'SALARIO' }], isLoading: false } as UseQueryResult<NoInfer<Budget[]>>)
    vi.mocked(useFuel).mockReturnValue({ data: [{ value: 80 }, { value: 20 }], isLoading: false } as UseQueryResult<NoInfer<Fuel[]>>)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('includes fuel in expense total and breakdown on the home page', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    expect(screen.getByText('Despesas')).toBeInTheDocument()
    expect(screen.getByText('R$ 220,00')).toBeInTheDocument()
    expect(screen.getByText('Saldo')).toBeInTheDocument()
    expect(screen.getByText('R$ 80,00')).toBeInTheDocument()

    const buttons = screen.getAllByLabelText('Ver detalhes')
    await user.click(buttons[0])
    expect(screen.getByText('Combustível')).toBeInTheDocument()
  })
})
