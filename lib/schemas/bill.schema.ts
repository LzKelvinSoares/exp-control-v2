import { z } from 'zod'

export const billSchema = z.object({
  description: z.string().min(1, 'Nome é obrigatório'),
  type:        z.string().min(1, 'Categoria é obrigatória'),
  value:       z.number().positive('Valor deve ser positivo'),
  expirationDate: z.string().min(1, 'Vencimento é obrigatório'),
  barCode:     z.string().optional(),
})

export type BillFormData = z.infer<typeof billSchema>
