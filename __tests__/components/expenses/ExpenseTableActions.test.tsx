import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpenseTableActions } from '@/components/expenses/columns/ExpenseTableActions'
import type { Expense } from '@/types/app-types'

const expense: Expense = { id: '4', userId: 'u1', currencyCurrencyAccount: 'BRL', description: 'Mercado', type: 'COMPRAS', value: 300, firstExpirationDate: '2025-01-15' }

describe('ExpenseTableActions', () => {
  it('renders three buttons', () => {
    render(<ExpenseTableActions expense={expense} onEdit={vi.fn()} onClone={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('calls onEdit with the expense when edit button clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseTableActions expense={expense} onEdit={onEdit} onClone={vi.fn()} onDelete={vi.fn()} />)
    await user.click(screen.getAllByRole('button')[0])
    expect(onEdit).toHaveBeenCalledWith(expense)
  })

  it('calls onClone with the expense when clone button clicked', async () => {
    const onClone = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseTableActions expense={expense} onEdit={vi.fn()} onClone={onClone} onDelete={vi.fn()} />)
    await user.click(screen.getAllByRole('button')[1])
    expect(onClone).toHaveBeenCalledWith(expense)
  })

  it('calls onDelete with id when delete button clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseTableActions expense={expense} onEdit={vi.fn()} onClone={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getAllByRole('button')[2])
    expect(onDelete).toHaveBeenCalledWith('4')
  })
})
