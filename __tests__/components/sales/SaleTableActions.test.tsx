import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SaleTableActions } from '@/components/sales/columns/SaleTableActions'
import type { Sale } from '@/types/app-types'

const sale: Sale = {
  id: '2', description: 'Venda', roomDescription: 'OUTROS', value: 500, saleDate: '2025-01-01',
  room: 'SALA',
  paid: false,
  delivered: false
}

describe('SaleTableActions', () => {
  it('calls onEdit with the sale when edit button is clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<SaleTableActions sale={sale} onEdit={onEdit} onDelete={vi.fn()} />)
    await user.click(screen.getAllByRole('button')[0])
    expect(onEdit).toHaveBeenCalledWith(sale)
  })

  it('calls onDelete with the sale id when delete button is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<SaleTableActions sale={sale} onEdit={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getAllByRole('button')[1])
    expect(onDelete).toHaveBeenCalledWith('2')
  })
})
