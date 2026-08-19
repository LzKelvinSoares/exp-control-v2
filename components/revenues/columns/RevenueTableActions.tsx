import { Pencil, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Budget } from '@/types/app-types'

interface RevenueTableActionsProps {
  revenue: Budget
  onEdit: (revenue: Budget) => void
  onClone: (revenue: Budget) => void
  onDelete: (id: string) => void
}

export function RevenueTableActions({ revenue, onEdit, onClone, onDelete }: RevenueTableActionsProps) {
  return (
    <>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(revenue)}>
        <Pencil size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClone(revenue)}>
        <Copy size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDelete(String(revenue.id))}>
        <Trash2 size={13} />
      </Button>
    </>
  )
}
