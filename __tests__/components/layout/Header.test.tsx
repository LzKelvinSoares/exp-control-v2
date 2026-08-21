import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/layout/Header'

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}))
vi.mock('@/components/layout/ThemeProvider', () => ({
  useTheme: vi.fn(),
}))
vi.mock('@/store/sidebar', () => ({
  useSidebar: vi.fn(),
}))
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}))
vi.mock('@/lib/actions/services/currency.service', () => ({
  switchCurrency: vi.fn(),
}))

import { useSession } from 'next-auth/react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useSidebar } from '@/store/sidebar'
import { useQueryClient } from '@tanstack/react-query'

const mockToggle = vi.fn()
const mockSetTheme = vi.fn()
const mockInvalidate = vi.fn()

beforeEach(() => {
  vi.mocked(useSidebar).mockReturnValue({ toggle: mockToggle } as unknown as ReturnType<typeof useSidebar>)
  vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: mockSetTheme } as unknown as ReturnType<typeof useTheme>)
  vi.mocked(useQueryClient).mockReturnValue({ invalidateQueries: mockInvalidate } as unknown as ReturnType<typeof useQueryClient>)
})

afterEach(() => vi.clearAllMocks())

describe('Header', () => {
  it('renders without crashing when session is null', () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() } as unknown as ReturnType<typeof useSession>)
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('shows user initials in avatar when session has name', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'João Silva', image: '', currencyAccounts: [], points: 10 } },
      status: 'authenticated',
      update: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)
    render(<Header />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('shows fallback ? when session user has no name', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: null, image: '', currencyAccounts: [], points: 0 } },
      status: 'authenticated',
      update: vi.fn(),
    } as unknown as ReturnType<typeof useSession>)
    render(<Header />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('calls sidebar toggle when menu button clicked', async () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() } as unknown as ReturnType<typeof useSession>)
    const user = userEvent.setup()
    render(<Header />)
    const menuBtn = screen.getAllByRole('button')[0]
    await user.click(menuBtn)
    expect(mockToggle).toHaveBeenCalled()
  })

  it('calls setTheme when theme toggle button clicked', async () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: vi.fn() } as unknown as ReturnType<typeof useSession>)
    const user = userEvent.setup()
    render(<Header />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
