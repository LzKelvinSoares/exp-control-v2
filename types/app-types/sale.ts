export type SaleRoom = 'SALA' | 'QUARTO' | 'COZINHA' | 'BANHEIRO' | 'ESCRITORIO' | 'ROOFTOP' | 'OUTRO'

export interface Sale {
  id?: string
  description: string
  room: SaleRoom
  roomDescription?: string
  buyer?: string
  value: number
  valuePaid?: string | number
  discount?: string | number
  installments?: number
  bookingDate?: Date | string
  saleDate?: Date | string
  paid: boolean
  delivered: boolean
  tieIn?: boolean
  tiedInItem?: string
  tiedInItemValue?: string | number
  boughtTogether?: boolean
  imgId?: string | null
  creationDate?: Date | string
}
