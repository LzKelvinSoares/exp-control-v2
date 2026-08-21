import { render, screen } from '@testing-library/react'
import { DataCard } from '@/components/shared/DataCard'

describe('DataCard', () => {
  it('renders primary content', () => {
    render(<DataCard primary={<span>Title</span>} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders value when provided', () => {
    render(<DataCard primary="p" value={<span>$100</span>} />)
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('does not render value slot when omitted', () => {
    const { container } = render(<DataCard primary="p" />)
    expect(container.querySelectorAll('.shrink-0').length).toBe(0)
  })

  it('renders meta content when provided', () => {
    render(<DataCard primary="p" meta={<span>meta-info</span>} />)
    expect(screen.getByText('meta-info')).toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    render(<DataCard primary="p" actions={<button>Edit</button>} />)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<DataCard primary="p" className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
