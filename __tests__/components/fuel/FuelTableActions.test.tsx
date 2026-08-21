import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FuelTableActions } from '@/components/fuel/columns/FuelTableActions'
import type { Fuel } from '@/types/app-types'

const entry: Fuel = { id: '1', userId: 'u1', currencyCurrencyAccount: 'BRL', creationDate: '2025-01-01', value: 200, valuePerLiter: 5.99 }

describe('FuelTableActions', () => {
  it('calls onEdit with the entry when edit button is clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<FuelTableActions entry={entry} onEdit={onEdit} onDelete={vi.fn()} />)
    await user.click(screen.getAllByRole('button')[0])
    expect(onEdit).toHaveBeenCalledWith(entry)
  })

  it('calls onDelete with the entry id when delete button is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<FuelTableActions entry={entry} onEdit={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getAllByRole('button')[1])
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('renders two buttons', () => {
    render(<FuelTableActions entry={entry} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})
