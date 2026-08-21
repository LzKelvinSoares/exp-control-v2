import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BillsDueSoon from '@/components/dashboard/BillsDueSoon'

vi.mock('@/hooks/queries/bills/use-bills-due-soon', () => ({
  useBillsDueSoon: vi.fn(),
}))
vi.mock('@/hooks/mutations/bills/use-pay-bill', () => ({
  usePayBill: vi.fn(),
}))
vi.mock('@/hooks/use-currency-session', () => ({
  useCurrencySession: vi.fn(() => ({ currency: 'BRL' })),
}))

import { useBillsDueSoon } from '@/hooks/queries/bills/use-bills-due-soon'
import { usePayBill } from '@/hooks/mutations/bills/use-pay-bill'

const mockMutate = vi.fn()

beforeEach(() => {
  vi.mocked(usePayBill).mockReturnValue({ mutate: mockMutate, isPending: false } as unknown as ReturnType<typeof usePayBill>)
})

afterEach(() => vi.clearAllMocks())

describe('BillsDueSoon', () => {
  it('shows skeletons while loading', () => {
    vi.mocked(useBillsDueSoon).mockReturnValue({ data: undefined, isLoading: true } as unknown as ReturnType<typeof useBillsDueSoon>)
    const { container } = render(<BillsDueSoon />)
    expect(container.querySelectorAll('.animate-pulse, .h-10').length).toBeGreaterThan(0)
  })

  it('shows empty message when no unpaid bills', () => {
    vi.mocked(useBillsDueSoon).mockReturnValue({ data: [], isLoading: false } as unknown as ReturnType<typeof useBillsDueSoon>)
    render(<BillsDueSoon />)
    expect(screen.getByText('Nenhuma conta a vencer')).toBeInTheDocument()
  })

  it('renders unpaid bills', () => {
    vi.mocked(useBillsDueSoon).mockReturnValue({
      data: [{ id: '1', description: 'Conta de Luz', expirationDate: '2025-01-31', value: 150, paid: false }],
      isLoading: false,
    } as unknown as ReturnType<typeof useBillsDueSoon>)
    render(<BillsDueSoon />)
    expect(screen.getByText('Conta de Luz')).toBeInTheDocument()
  })

  it('does not render paid bills', () => {
    vi.mocked(useBillsDueSoon).mockReturnValue({
      data: [{ id: '1', description: 'Already Paid', expirationDate: '2025-01-31', value: 100, paid: true }],
      isLoading: false,
    } as unknown as ReturnType<typeof useBillsDueSoon>)
    render(<BillsDueSoon />)
    expect(screen.queryByText('Already Paid')).not.toBeInTheDocument()
    expect(screen.getByText('Nenhuma conta a vencer')).toBeInTheDocument()
  })

  it('calls payBill.mutate when pay button clicked', async () => {
    vi.mocked(useBillsDueSoon).mockReturnValue({
      data: [{ id: '1', description: 'Internet', expirationDate: '2025-01-31', value: 100, paid: false }],
      isLoading: false,
    } as unknown as ReturnType<typeof useBillsDueSoon>)
    const user = userEvent.setup()
    render(<BillsDueSoon />)
    await user.click(screen.getByTitle('Marcar como pago'))
    expect(mockMutate).toHaveBeenCalledWith('1')
  })
})
