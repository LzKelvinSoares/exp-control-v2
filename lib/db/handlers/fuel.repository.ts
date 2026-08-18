import FuelModel from '@/models/Fuel'
import { findMany, createOne, updateOne, deleteOne } from '../crud'
import { Fuel } from '@/types/app-types'
import { IGetByMonthAndYearProps, IGetByYearProps, IFullTableCrudRepository } from '@/types/server-types'

export class FuelRepository implements IFullTableCrudRepository<Fuel> {
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
}
