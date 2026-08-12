import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Sale } from '@/types'

interface Props {
  sale: Sale
  onEdit: (sale: Sale) => void
  onDelete: (id: string) => void
}

export function SaleTableActions({ sale, onEdit, onDelete }: Props) {
  return (
    <>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(sale)}>
        <Pencil size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDelete(String(sale.id))}>
        <Trash2 size={13} />
      </Button>
    </>
  )
}
