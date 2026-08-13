import { z } from 'zod'

const marketItemSchema = z.object({
  description:  z.string().min(1, 'Descrição obrigatória'),
  quantity:     z.number().positive('Deve ser positivo'),
  unit:         z.string().min(1, 'Unidade obrigatória'),
  value:        z.number().positive('Deve ser positivo'),
  valuePerUnit: z.number().positive(),
})

export const expenseSchema = z.object({
  description:         z.string().min(1, 'Descrição é obrigatória'),
  type:                z.string().min(1, 'Categoria é obrigatória'),
  responsible:         z.string().optional(),
  value:               z.number().positive('Valor deve ser positivo'),
  monthsLeft:          z.number().int().min(1),
  firstExpirationDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  marketItems:         z.array(marketItemSchema).optional(),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>
