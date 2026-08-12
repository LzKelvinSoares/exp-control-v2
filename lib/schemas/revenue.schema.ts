import { z } from 'zod'

export const revenueSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  type:        z.string().min(1, 'Categoria é obrigatória'),
  responsible: z.string().optional(),
  value:       z.number().positive('Valor deve ser positivo'),
  monthsLeft:  z.number().int().min(1),
})

export type RevenueFormData = z.infer<typeof revenueSchema>
