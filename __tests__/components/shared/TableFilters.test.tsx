import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableFilters } from '@/components/shared/TableFilters'

describe('TableFilters', () => {
  const onFilter = vi.fn()
  const onClear = vi.fn()

  afterEach(() => vi.clearAllMocks())

  it('renders a text input filter', () => {
    render(
      <TableFilters
        defs={[{ key: 'search', type: 'text', label: 'Buscar', placeholder: 'Buscar...' }]}
        values={{}}
        hasActive={false}
        onFilter={onFilter}
        onClear={onClear}
      />
    )
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('renders a date input filter', () => {
    render(
      <TableFilters
        defs={[{ key: 'date', type: 'date', label: 'Data' }]}
        values={{}}
        hasActive={false}
        onFilter={onFilter}
        onClear={onClear}
      />
    )
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'date')
  })

  it('calls onFilter when text input changes', async () => {
    const user = userEvent.setup()
    render(
      <TableFilters
        defs={[{ key: 'search', type: 'text', label: 'Buscar' }]}
        values={{}}
        hasActive={false}
        onFilter={onFilter}
        onClear={onClear}
      />
    )
    await user.type(screen.getByRole('textbox'), 'abc')
    expect(onFilter).toHaveBeenCalledWith('search', 'a')
  })

  it('shows clear button when hasActive is true', () => {
    render(
      <TableFilters
        defs={[]}
        values={{}}
        hasActive={true}
        onFilter={onFilter}
        onClear={onClear}
      />
    )
    expect(screen.getByText('Limpar')).toBeInTheDocument()
  })

  it('hides clear button when hasActive is false', () => {
    render(
      <TableFilters
        defs={[]}
        values={{}}
        hasActive={false}
        onFilter={onFilter}
        onClear={onClear}
      />
    )
    expect(screen.queryByText('Limpar')).not.toBeInTheDocument()
  })

  it('calls onClear when clear button clicked', async () => {
    const user = userEvent.setup()
    render(
      <TableFilters
        defs={[]}
        values={{}}
        hasActive={true}
        onFilter={onFilter}
        onClear={onClear}
      />
    )
    await user.click(screen.getByText('Limpar'))
    expect(onClear).toHaveBeenCalled()
  })
})
