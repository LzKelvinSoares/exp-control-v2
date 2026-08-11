import { z } from 'zod'

export const fuelSchema = z.object({
  date:          z.string().min(1, 'Data é obrigatória'),
  totalCost:     z.number().positive('Custo total deve ser positivo'),
  pricePerLiter: z.number().positive('Preço por litro deve ser positivo'),
})

export type FuelFormData = z.infer<typeof fuelSchema>
