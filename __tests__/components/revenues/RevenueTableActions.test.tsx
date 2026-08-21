import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RevenueTableActions } from '@/components/revenues/columns/RevenueTableActions'
import type { Budget } from '@/types/app-types'

const revenue: Budget = { id: '5', userId: 'u1', currencyCurrencyAccount: 'BRL', description: 'Salário', type: 'SALARIO', value: 3000, firstExpirationDate: '2025-01-05' }

describe('RevenueTableActions', () => {
  it('renders three buttons', () => {
    render(<RevenueTableActions revenue={revenue} onEdit={vi.fn()} onClone={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('calls onEdit with revenue when edit button clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<RevenueTableActions revenue={revenue} onEdit={onEdit} onClone={vi.fn()} onDelete={vi.fn()} />)
    await user.click(screen.getAllByRole('button')[0])
    expect(onEdit).toHaveBeenCalledWith(revenue)
  })

  it('calls onDelete with id when delete button clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<RevenueTableActions revenue={revenue} onEdit={vi.fn()} onClone={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getAllByRole('button')[2])
    expect(onDelete).toHaveBeenCalledWith('5')
  })
})
