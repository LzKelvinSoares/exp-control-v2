import { Pencil, Trash2, CheckCircle2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Bill } from '@/types/app-types'

interface BillTableActionsProps {
  bill: Bill
  onEdit: (bill: Bill) => void
  onClone: (bill: Bill) => void
  onDelete: (id: string) => void
  onPay: (id: string) => void
  isPaying: boolean
}

export function BillTableActions({ bill, onEdit, onClone, onDelete, onPay, isPaying }: BillTableActionsProps) {
  const id = String(bill.id)
  return (
    <>
      {!bill.paid && (
        <Button variant='ghost' size='icon' className='h-7 w-7 text-emerald-600' onClick={() => onPay(id)} disabled={isPaying}>
          <CheckCircle2 size={13} />
        </Button>
      )}
      <Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => onEdit(bill)}>
        <Pencil size={13} />
      </Button>
      <Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => onClone(bill)}>
        <Copy size={13} />
      </Button>
      <Button variant='ghost' size='icon' className='h-7 w-7 text-red-500' onClick={() => onDelete(id)}>
        <Trash2 size={13} />
      </Button>
    </>
  )
}
