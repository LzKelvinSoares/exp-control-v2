import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrendingUp } from 'lucide-react'
import SummaryCard from '@/components/shared/SummaryCard'

describe('SummaryCard', () => {
  const defaultProps = { label: 'Receita', value: 'R$ 1.000', icon: TrendingUp }

  it('renders label and value', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.getByText('Receita')).toBeInTheDocument()
    expect(screen.getByText('R$ 1.000')).toBeInTheDocument()
  })

  it('shows skeleton when loading', () => {
    const { container } = render(<SummaryCard {...defaultProps} loading />)
    expect(container.querySelector('.animate-pulse, [data-testid="skeleton"], .h-6')).toBeTruthy()
    expect(screen.queryByText('R$ 1.000')).not.toBeInTheDocument()
  })

  it('does not show breakdown toggle when no breakdown provided', () => {
    render(<SummaryCard {...defaultProps} />)
    expect(screen.queryByLabelText(/Ver detalhes|Ocultar detalhes/)).not.toBeInTheDocument()
  })

  it('shows breakdown toggle when breakdown is provided', () => {
    render(<SummaryCard {...defaultProps} breakdown={[{ label: 'Item A', value: 'R$ 500' }]} />)
    expect(screen.getByLabelText('Ver detalhes')).toBeInTheDocument()
  })

  it('toggles breakdown items on button click', async () => {
    const user = userEvent.setup()
    render(
      <SummaryCard
        {...defaultProps}
        breakdown={[
          { label: 'Item A', value: 'R$ 500' },
          { label: 'Item B', value: 'R$ 500' },
        ]}
      />
    )
    expect(screen.queryByText('Item A')).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Ver detalhes'))
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  it('hides breakdown on second toggle click', async () => {
    const user = userEvent.setup()
    render(<SummaryCard {...defaultProps} breakdown={[{ label: 'Item A', value: 'R$ 500' }]} />)
    const btn = screen.getByLabelText('Ver detalhes')
    await user.click(btn)
    await user.click(screen.getByLabelText('Ocultar detalhes'))
    expect(screen.queryByText('Item A')).not.toBeInTheDocument()
  })
})
