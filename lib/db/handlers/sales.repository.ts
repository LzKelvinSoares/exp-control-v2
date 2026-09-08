import SaleModel from '@/models/Sale'
import { findMany, createOne, updateOne, deleteOne } from '../crud'
import { Sale } from '@/types/app-types'
import { IMCPQueryRepository, QueryFilters } from '@/types/server-types';

export class SalesRepository implements IMCPQueryRepository<Sale> {
  async getAllByCurrency(currency: string) {
    return findMany(SaleModel, currency ? { currencyCurrencyAccount: currency } : {});
  }

  async create(data: Omit<Sale, 'id' | 'creationDate'>): Promise<Sale[]> {
    return createOne(SaleModel, data);
  }

  async update(id: string, data: Partial<Sale>) {
    return updateOne(SaleModel, id, data);
  }

  async delete(id: string){
    return deleteOne(SaleModel, id);
  }

  async queryWithFilters(userId: string, currency: string, filters: QueryFilters) {
    const { type, paid, description, room, minValue, maxValue } = filters;

    const filter: Record<string, unknown> = {
      userId,
      currencyCurrencyAccount: currency,
    };

    if (type) filter.type = type;
    if (paid) filter.paid = { $regex: paid, $options: 'i' };
    if (description) filter.description = { $regex: description, $options: 'i' };
    if (room) filter.room = room;

    if (minValue !== undefined || maxValue !== undefined) {
      const valueFilter: Record<string, number> = {};
      if (minValue !== undefined) valueFilter.$gte = minValue;
      if (maxValue !== undefined) valueFilter.$lte = maxValue;
      filter.value = valueFilter;
    }

    return findMany(SaleModel, filter);

  }
}
