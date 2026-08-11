import { z } from 'zod'
import { SALE_ROOM_ENUM, PAYMENT_STATUS_ENUM, DELIVERY_STATUS_ENUM } from '@/constants'
import { toZodEnum } from './helpers'

export const saleSchema = z.object({
  name:           z.string().min(1, 'Nome é obrigatório'),
  room:           z.enum(toZodEnum(SALE_ROOM_ENUM)),
  buyer:          z.string().optional(),
  value:          z.number().positive('Valor deve ser positivo'),
  discount:       z.number().min(0).optional(),
  installments:   z.number().int().min(1).optional(),
  bookingDate:    z.string().optional(),
  saleDate:       z.string().optional(),
  paymentStatus:  z.enum(toZodEnum(PAYMENT_STATUS_ENUM)),
  deliveryStatus: z.enum(toZodEnum(DELIVERY_STATUS_ENUM)),
})

export type SaleFormData = z.infer<typeof saleSchema>
