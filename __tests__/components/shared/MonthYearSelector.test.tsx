import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MonthYearSelector from '@/components/shared/MonthYearSelector'
import { useCalendar } from '@/store/calendar'

beforeEach(() => {
  useCalendar.setState({ month: 6, year: 2025, setMonth: useCalendar.getState().setMonth, setYear: useCalendar.getState().setYear })
})

describe('MonthYearSelector', () => {
  it('displays current month and year', () => {
    render(<MonthYearSelector />)
    expect(screen.getByText(/Junho 2025/)).toBeInTheDocument()
  })

  it('goes to previous month on left arrow click', async () => {
    const user = userEvent.setup()
    render(<MonthYearSelector />)
    await user.click(screen.getAllByRole('button')[0])
    expect(screen.getByText(/Maio 2025/)).toBeInTheDocument()
  })

  it('goes to next month on right arrow click', async () => {
    const user = userEvent.setup()
    render(<MonthYearSelector />)
    await user.click(screen.getAllByRole('button')[1])
    expect(screen.getByText(/Julho 2025/)).toBeInTheDocument()
  })

  it('wraps to December of previous year when going back from January', async () => {
    useCalendar.setState({ month: 1, year: 2025, setMonth: useCalendar.getState().setMonth, setYear: useCalendar.getState().setYear })
    const user = userEvent.setup()
    render(<MonthYearSelector />)
    await user.click(screen.getAllByRole('button')[0])
    expect(screen.getByText(/Dezembro 2024/)).toBeInTheDocument()
  })

  it('wraps to January of next year when going forward from December', async () => {
    useCalendar.setState({ month: 12, year: 2025, setMonth: useCalendar.getState().setMonth, setYear: useCalendar.getState().setYear })
    const user = userEvent.setup()
    render(<MonthYearSelector />)
    await user.click(screen.getAllByRole('button')[1])
    expect(screen.getByText(/Janeiro 2026/)).toBeInTheDocument()
  })
})
