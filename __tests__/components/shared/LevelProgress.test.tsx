import { render, screen } from '@testing-library/react'
import LevelProgress from '@/components/shared/LevelProgress'

vi.mock('@/hooks/queries/user/use-user-points', () => ({
  useUserPoints: vi.fn(),
}))

import { useUserPoints } from '@/hooks/queries/user/use-user-points'

describe('LevelProgress', () => {
  it('shows Iniciante at 0 points', () => {
    vi.mocked(useUserPoints).mockReturnValue({ data: { points: 0 } } as unknown as ReturnType<typeof useUserPoints>)
    render(<LevelProgress />)
    expect(screen.getByText('Iniciante')).toBeInTheDocument()
    expect(screen.getByText('0 pts')).toBeInTheDocument()
  })

  it('shows Aprendiz at 21 points', () => {
    vi.mocked(useUserPoints).mockReturnValue({ data: { points: 21 } } as unknown as ReturnType<typeof useUserPoints>)
    render(<LevelProgress />)
    expect(screen.getByText('Aprendiz')).toBeInTheDocument()
  })

  it('shows 100% progress bar at max level', () => {
    vi.mocked(useUserPoints).mockReturnValue({ data: { points: 201 } } as unknown as ReturnType<typeof useUserPoints>)
    const { container } = render(<LevelProgress />)
    const bar = container.querySelector('[style*="width: 100%"]')
    expect(bar).toBeTruthy()
  })

  it('shows next level hint when not at max', () => {
    vi.mocked(useUserPoints).mockReturnValue({ data: { points: 0 } } as unknown as ReturnType<typeof useUserPoints>)
    render(<LevelProgress />)
    expect(screen.getByText(/Aprendiz em/)).toBeInTheDocument()
  })

  it('hides next level hint at max level', () => {
    vi.mocked(useUserPoints).mockReturnValue({ data: { points: 201 } } as unknown as ReturnType<typeof useUserPoints>)
    render(<LevelProgress />)
    expect(screen.queryByText(/em \d+ pts/)).not.toBeInTheDocument()
  })
})
