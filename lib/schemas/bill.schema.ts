import { z } from 'zod'
import { BILL_CATEGORY_ENUM } from '@/constants'
import { toZodEnum } from './helpers'

export const billSchema = z.object({
  name:     z.string().min(1, 'Nome é obrigatório'),
  category: z.enum(toZodEnum(BILL_CATEGORY_ENUM)),
  value:    z.number().positive('Valor deve ser positivo'),
  dueDate:  z.string().min(1, 'Vencimento é obrigatório'),
  barcode:  z.string().optional(),
})

export type BillFormData = z.infer<typeof billSchema>
