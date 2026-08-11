import type { CategoryOption, SaleRoom, PaymentStatus, DeliveryStatus } from '@/types'

export const SALE_ROOMS: CategoryOption<SaleRoom>[] = [
  { value: 'SALA',     label: 'Sala' },
  { value: 'QUARTO',   label: 'Quarto' },
  { value: 'COZINHA',  label: 'Cozinha' },
  { value: 'BANHEIRO', label: 'Banheiro' },
  { value: 'OUTROS',   label: 'Outros' },
]

export const PAYMENT_STATUSES: CategoryOption<PaymentStatus>[] = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'PARTIAL', label: 'Parcial' },
  { value: 'PAID',    label: 'Pago' },
]

export const DELIVERY_STATUSES: CategoryOption<DeliveryStatus>[] = [
  { value: 'PENDING',   label: 'Pendente' },
  { value: 'SHIPPED',   label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregue' },
]
