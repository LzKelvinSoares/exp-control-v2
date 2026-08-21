import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from '@/components/layout/Sidebar'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}))
vi.mock('@/store/sidebar', () => ({
  useSidebar: vi.fn(),
}))
vi.mock('@/components/shared/LevelProgress', () => ({
  default: () => <div data-testid="level-progress" />,
}))

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useSidebar } from '@/store/sidebar'

const mockClose = vi.fn()
const mockToggleCollapsed = vi.fn()

beforeEach(() => {
  vi.mocked(usePathname).mockReturnValue('/')
  vi.mocked(useSidebar).mockReturnValue({
    isOpen: true,
    isCollapsed: false,
    close: mockClose,
    toggleCollapsed: mockToggleCollapsed,
    open: vi.fn(),
    toggle: vi.fn(),
  } as unknown as ReturnType<typeof useSidebar>)
})

afterEach(() => vi.clearAllMocks())

describe('Sidebar', () => {
  it('renders the logo', () => {
    render(<Sidebar />)
    expect(screen.getByAltText('ExpControl')).toBeInTheDocument()
  })

  it('renders brand name when not collapsed', () => {
    render(<Sidebar />)
    expect(screen.getByText('ExpControl')).toBeInTheDocument()
  })

  it('hides brand name when collapsed', () => {
    vi.mocked(useSidebar).mockReturnValue({
      isOpen: true,
      isCollapsed: true,
      close: mockClose,
      toggleCollapsed: mockToggleCollapsed,
      open: vi.fn(),
      toggle: vi.fn(),
    } as unknown as ReturnType<typeof useSidebar>)
    render(<Sidebar />)
    expect(screen.queryByText('ExpControl')).not.toBeInTheDocument()
  })

  it('shows LevelProgress when not collapsed', () => {
    render(<Sidebar />)
    expect(screen.getByTestId('level-progress')).toBeInTheDocument()
  })

  it('hides LevelProgress when collapsed', () => {
    vi.mocked(useSidebar).mockReturnValue({
      isOpen: true,
      isCollapsed: true,
      close: mockClose,
      toggleCollapsed: mockToggleCollapsed,
      open: vi.fn(),
      toggle: vi.fn(),
    } as unknown as ReturnType<typeof useSidebar>)
    render(<Sidebar />)
    expect(screen.queryByTestId('level-progress')).not.toBeInTheDocument()
  })

  it('shows mobile backdrop when sidebar is open', () => {
    const { container } = render(<Sidebar />)
    expect(container.querySelector('.bg-black\\/50')).toBeInTheDocument()
  })

  it('calls signOut when logout button clicked', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    await user.click(screen.getByText('Sair'))
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' })
  })

  it('calls close when mobile backdrop clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<Sidebar />)
    const backdrop = container.querySelector('.bg-black\\/50') as HTMLElement
    await user.click(backdrop)
    expect(mockClose).toHaveBeenCalled()
  })
})
