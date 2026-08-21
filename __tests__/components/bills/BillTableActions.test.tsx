import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BillTableActions } from '@/components/bills/columns/BillTableActions'
import type { Bill } from '@/types/app-types'

const unpaidBill: Bill = { id: '3', userId: 'u1', currencyCurrencyAccount: 'BRL', description: 'Luz', type: 'ENERGIA', value: 150, expirationDate: '2025-01-31', paid: false }
const paidBill: Bill = { ...unpaidBill, paid: true }

describe('BillTableActions', () => {
  it('shows pay button for unpaid bill', () => {
    render(<BillTableActions bill={unpaidBill} onEdit={vi.fn()} onClone={vi.fn()} onDelete={vi.fn()} onPay={vi.fn()} isPaying={false} />)
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(4)
  })

  it('hides pay button for paid bill', () => {
    render(<BillTableActions bill={paidBill} onEdit={vi.fn()} onClone={vi.fn()} onDelete={vi.fn()} onPay={vi.fn()} isPaying={false} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('calls onPay with id when pay button clicked', async () => {
    const onPay = vi.fn()
    const user = userEvent.setup()
    render(<BillTableActions bill={unpaidBill} onEdit={vi.fn()} onClone={vi.fn()} onDelete={vi.fn()} onPay={onPay} isPaying={false} />)
    await user.click(screen.getAllByRole('button')[0])
    expect(onPay).toHaveBeenCalledWith('3')
  })

  it('disables pay button while isPaying', () => {
    render(<BillTableActions bill={unpaidBill} onEdit={vi.fn()} onClone={vi.fn()} onDelete={vi.fn()} onPay={vi.fn()} isPaying={true} />)
    expect(screen.getAllByRole('button')[0]).toBeDisabled()
  })

  it('calls onEdit with bill when edit button clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<BillTableActions bill={unpaidBill} onEdit={onEdit} onClone={vi.fn()} onDelete={vi.fn()} onPay={vi.fn()} isPaying={false} />)
    await user.click(screen.getAllByRole('button')[1])
    expect(onEdit).toHaveBeenCalledWith(unpaidBill)
  })

  it('calls onDelete with id when delete button clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<BillTableActions bill={unpaidBill} onEdit={vi.fn()} onClone={vi.fn()} onDelete={onDelete} onPay={vi.fn()} isPaying={false} />)
    await user.click(screen.getAllByRole('button')[3])
    expect(onDelete).toHaveBeenCalledWith('3')
  })
})
