import { Pencil, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Expense } from '@/types/app-types'

interface ExpenseTableActionsProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onClone: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseTableActions({ expense, onEdit, onClone, onDelete }: ExpenseTableActionsProps) {
  return (
    <>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(expense)}>
        <Pencil size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClone(expense)}>
        <Copy size={13} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDelete(String(expense.id))}>
        <Trash2 size={13} />
      </Button>
    </>
  )
}
