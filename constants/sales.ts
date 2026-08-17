import { CategoryOption, SaleRoom } from '@/types/app-types';

export const SALE_ROOMS: CategoryOption<SaleRoom>[] = [
  { value: 'SALA',       label: 'Sala' },
  { value: 'QUARTO',     label: 'Quarto' },
  { value: 'COZINHA',    label: 'Cozinha' },
  { value: 'BANHEIRO',   label: 'Banheiro' },
  { value: 'ESCRITORIO', label: 'Escritório' },
  { value: 'ROOFTOP',    label: 'Rooftop' },
  { value: 'OUTRO',      label: 'Outros' },
]
