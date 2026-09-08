import FuelModel from '@/models/Fuel'
import { findMany, createOne, updateOne, deleteOne } from '../crud'
import { Fuel } from '@/types/app-types'
import { IGetByMonthAndYearProps, IGetByYearProps, IFullMCPQueryRepository, QueryFilters } from '@/types/server-types'
import { buildDateRange } from '@/lib/utils';

export class FuelRepository implements IFullMCPQueryRepository<Fuel> {
  async getByMonthAndYear({ userId, currency, month, year }: IGetByMonthAndYearProps) {
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 1).toISOString();
    return findMany(FuelModel, { userId, currencyCurrencyAccount: currency, creationDate: { $gte: start, $lt: end } });
  }

  async getByYear({ userId, currency, year }: IGetByYearProps) {
    const start = new Date(year, 0, 1).toISOString();
    const end = new Date(year + 1, 0, 1).toISOString();
    return findMany(FuelModel, { userId, currencyCurrencyAccount: currency, creationDate: { $gte: start, $lt: end } });
  }

  async create(data: Omit<Fuel, 'id'>): Promise<Fuel[]> {
    return createOne(FuelModel, data);
  }

  async update(id: string, data: Partial<Fuel>) {
    return updateOne(FuelModel, id, data);
  }

  async delete(id: string){
    return deleteOne(FuelModel, id);
  }

  async queryWithFilters(userId: string, currency: string, filters: QueryFilters) {
    const { year, month, minValue, maxValue } = filters;
    const { start, end } = buildDateRange(year, month);

    const filter: Record<string, unknown> = {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    };

    if (minValue !== undefined || maxValue !== undefined) {
      const valueFilter: Record<string, number> = {};
      if (minValue !== undefined) valueFilter.$gte = minValue;
      if (maxValue !== undefined) valueFilter.$lte = maxValue;
      filter.value = valueFilter;
    }

    return findMany(FuelModel, filter);

  }
}
