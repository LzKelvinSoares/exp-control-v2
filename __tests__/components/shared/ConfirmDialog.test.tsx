import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

describe('ConfirmDialog', () => {
  const base = { open: true, onConfirm: vi.fn(), onCancel: vi.fn() }

  afterEach(() => vi.clearAllMocks())

  it('renders title and description', () => {
    render(<ConfirmDialog {...base} title="Delete item" description="Cannot undo." />)
    expect(screen.getByText('Delete item')).toBeInTheDocument()
    expect(screen.getByText('Cannot undo.')).toBeInTheDocument()
  })

  it('uses default title and description when not provided', () => {
    render(<ConfirmDialog {...base} />)
    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog {...base} onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()
    render(<ConfirmDialog {...base} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('disables buttons and shows loading text while loading', () => {
    render(<ConfirmDialog {...base} loading />)
    expect(screen.getByRole('button', { name: 'Excluindo...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })

  it('does not render content when closed', () => {
    render(<ConfirmDialog {...base} open={false} />)
    expect(screen.queryByText('Confirmar exclusão')).not.toBeInTheDocument()
  })
})
