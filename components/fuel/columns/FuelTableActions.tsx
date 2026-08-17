import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Fuel } from '@/types/app-types'

interface FuelTableActionsProps {
  entry: Fuel
  onEdit: (entry: Fuel) => void
  onDelete: (id: string) => void
}

export function FuelTableActions({ entry, onEdit, onDelete }: FuelTableActionsProps) {
  return (
    <>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(entry)}>
        <Pencil size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDelete(String(entry.id))}>
        <Trash2 size={13} />
      </Button>
    </>
  )
}
