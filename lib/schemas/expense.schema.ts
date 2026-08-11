import { z } from 'zod'
import { EXPENSE_CATEGORY_ENUM } from '@/constants'
import { toZodEnum } from './helpers'

const marketItemSchema = z.object({
  description:  z.string().min(1, 'Descrição obrigatória'),
  quantity:     z.number().positive('Deve ser positivo'),
  unit:         z.string().min(1, 'Unidade obrigatória'),
  value:        z.number().positive('Deve ser positivo'),
  valuePerUnit: z.number().positive(),
})

export const expenseSchema = z.object({
  description:  z.string().min(1, 'Descrição é obrigatória'),
  category:     z.enum(toZodEnum(EXPENSE_CATEGORY_ENUM)),
  responsible:  z.string().min(1, 'Responsável é obrigatório'),
  value:        z.number().positive('Valor deve ser positivo'),
  installments: z.number().int().min(1),
  marketItems:  z.array(marketItemSchema).optional(),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>
