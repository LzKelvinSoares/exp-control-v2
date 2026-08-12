import { z } from 'zod'

export const fuelSchema = z.object({
  creationDate:  z.string().min(1, 'Data é obrigatória'),
  value:         z.number().positive('Custo total deve ser positivo'),
  valuePerLiter: z.number().positive('Preço por litro deve ser positivo'),
})

export type FuelFormData = z.infer<typeof fuelSchema>
