import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SaleTable from '@/components/sales/SaleTable'

vi.mock('@/hooks/use-currency-session', () => ({
  useCurrencySession: vi.fn(() => ({ currency: 'BRL' })),
}))

vi.mock('@/hooks/mutations/sales/use-delete-sale', () => ({
  useDeleteSale: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('@/hooks/mutations/sales/use-create-sale', () => ({
  useCreateSale: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}))

vi.mock('@/hooks/mutations/sales/use-update-sale', () => ({
  useUpdateSale: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}))

describe('SaleTable', () => {
  it('shows the sale image preview button and opens the image modal', async () => {
    const user = userEvent.setup()

    render(
      <SaleTable
        sales={[
          {
            id: 'sale-1',
            description: 'Mesa de madeira',
            room: 'SALA',
            paid: false,
            delivered: false,
            value: 1500,
            imgId: 'https://drive.google.com/uc?export=view&id=abc123',
          },
        ]}
        loading={false}
      />
    )

    const previewButtons = screen.getAllByRole('button', { name: /ver imagem/i })
    expect(previewButtons[0]).toBeInTheDocument()

    await user.click(previewButtons[0])

    expect(screen.getAllByAltText(/imagem da venda mesa de madeira/i).length).toBeGreaterThan(0)
  })
})
