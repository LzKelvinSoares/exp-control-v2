import { z } from 'zod'
import { REVENUE_CATEGORY_ENUM } from '@/constants'
import { toZodEnum } from './helpers'

export const revenueSchema = z.object({
  description:  z.string().min(1, 'Descrição é obrigatória'),
  category:     z.enum(toZodEnum(REVENUE_CATEGORY_ENUM)),
  responsible:  z.string().min(1, 'Responsável é obrigatório'),
  value:        z.number().positive('Valor deve ser positivo'),
  installments: z.number().int().min(1),
})

export type RevenueFormData = z.infer<typeof revenueSchema>
