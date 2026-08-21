import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PageWrapper } from '@/components/shared/PageWrapper'

vi.mock('@/components/shared/MonthYearSelector', () => ({
  default: () => <div data-testid="month-year-selector" />,
}))

describe('PageWrapper', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the page title', () => {
    render(<PageWrapper title="Combustível" />)
    expect(screen.getByRole('heading', { name: 'Combustível' })).toBeInTheDocument()
  })

  it('renders MonthYearSelector by default', () => {
    render(<PageWrapper title="Test" />)
    expect(screen.getByTestId('month-year-selector')).toBeInTheDocument()
  })

  it('hides MonthYearSelector when hideMonthYearSelector is true', () => {
    render(<PageWrapper title="Test" hideMonthYearSelector />)
    expect(screen.queryByTestId('month-year-selector')).not.toBeInTheDocument()
  })

  it('renders add button when setAddModalOpen is provided', async () => {
    const setOpen = vi.fn()
    const user = userEvent.setup()
    render(<PageWrapper title="Test" addItem="Nova Despesa" setAddModalOpen={setOpen} />)
    await user.click(screen.getByRole('button'))
    expect(setOpen).toHaveBeenCalledWith(true)
  })

  it('does not render add button when setAddModalOpen is not provided', () => {
    render(<PageWrapper title="Test" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders children', () => {
    render(<PageWrapper title="Test"><span>child content</span></PageWrapper>)
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('renders secondaryActions when provided', () => {
    render(<PageWrapper title="Test" secondaryActions={<button>Export</button>} />)
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
  })
})
