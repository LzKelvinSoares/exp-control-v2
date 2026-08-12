import { z } from 'zod'
import { SALE_ROOM_ENUM } from '@/constants'
import { toZodEnum } from './helpers'

export const saleSchema = z.object({
  description:  z.string().min(1, 'Descrição é obrigatória'),
  room:         z.enum(toZodEnum(SALE_ROOM_ENUM)),
  buyer:        z.string().optional(),
  value:        z.number().positive('Valor deve ser positivo'),
  valuePaid:    z.string().optional(),
  discount:     z.union([z.string(), z.number()]).optional(),
  installments: z.number().int().min(1).optional(),
  bookingDate:  z.string().optional(),
  saleDate:     z.string().optional(),
  paid:         z.boolean(),
  delivered:    z.boolean(),
})

export type SaleFormData = z.infer<typeof saleSchema>
