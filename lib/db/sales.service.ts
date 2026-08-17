import SaleModel from '@/models/Sale'
import { findMany, createOne, updateOne, deleteOne, findById } from './crud'
import { Sale } from '@/types/app-types'
import { ITableCrudService } from '@/types/server-types';

export class SalesService implements ITableCrudService<Sale> {
  async getAll() {
    return findMany(SaleModel, {});
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
