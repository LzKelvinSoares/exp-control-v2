import { Eye, Pencil, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sale } from '@/types/app-types'

interface SaleTableActionsProps {
  sale: Sale
  onEdit: (sale: Sale) => void
  onClone: (sale: Sale) => void
  onDelete: (id: string) => void
  onPreview: (sale: Sale) => void
}

export function SaleTableActions({ sale, onEdit, onClone, onDelete, onPreview }: SaleTableActionsProps) {
  return (
    <>
      {sale.imgId && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPreview(sale)} aria-label="Ver imagem">
          <Eye size={13} />
        </Button>
      )}
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(sale)}>
        <Pencil size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClone(sale)}>
        <Copy size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDelete(String(sale.id))}>
        <Trash2 size={13} />
      </Button>
    </>
  )
}
