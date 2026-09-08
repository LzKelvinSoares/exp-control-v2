import SaleModel from '@/models/Sale'
import { findMany, createOne, updateOne, deleteOne } from '../crud'
import { Sale } from '@/types/app-types'
import { ITableCrudRepository } from '@/types/server-types';

export class SalesRepository implements ITableCrudRepository<Sale> {
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
}
