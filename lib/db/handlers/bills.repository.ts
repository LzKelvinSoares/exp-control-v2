import BillModel from '@/models/Bill'
import { findMany, createOne, updateOne, updateMany, deleteOne } from '../crud'
import { Bill } from '@/types/app-types'
import { IGetByMonthAndYearProps, IGetByYearProps, IMCPQueryRepository, QueryFilters } from '@/types/server-types';
import { buildDateRange, toGmtRange } from '../../utils';

export interface IBillsRepository extends IMCPQueryRepository<Bill> {
  getBillsDueSoon: (userId: string, currency: string, withinDays?: number) => Promise<Bill[]>;
  payBill: (id: string) => Promise<void>;
  payBills: (ids: string[]) => Promise<void>;
}

export class BillsRepository implements IBillsRepository {
  async getByMonthAndYear({ userId, currency, month, year }: IGetByMonthAndYearProps) {
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 1).toISOString();
    return findMany(BillModel, {
      userId,
      currencyCurrencyAccount: currency,
      expirationDate: { $gte: start, $lt: end },
    });
  }

  async getByYear({ userId, currency, year }: IGetByYearProps) {
    const start = new Date(year, 0, 1).toISOString()
    const end = new Date(year + 1, 0, 1).toISOString()
    return findMany(BillModel, {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    })
  }

  async getBillsDueSoon(userId: string, currency: string, withinDays = 5) {
    const initDate = new Date();
    initDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(initDate.getDate() + withinDays);
    const { start, end } = toGmtRange(initDate, endDate);
    return findMany(BillModel, {
      userId,
      currencyCurrencyAccount: currency,
      paid: false,
      expirationDate: { $gte: start.toISOString(), $lte: end.toISOString() },
    });
  }

  async create(data: Omit<Bill, 'id' | 'creationDate'>): Promise<Bill> {
    return createOne(BillModel, data);
  }

  async update(id: string, data: Partial<Bill>) {
    return updateOne(BillModel, id, data);
  }

  async payBill(id: string) {
    return updateOne(BillModel, id, { paid: true, paidAt: new Date() });
  }

  async payBills(ids: string[]) {
    return updateMany(BillModel, { id: { $in: ids } }, { paid: true, paidAt: new Date() });
  }

  async delete(id: string){
    return deleteOne(BillModel, id);
  }

  async queryWithFilters(userId: string, currency: string, filters: QueryFilters) {
    const { year, month, type, paid, description, minValue, maxValue } = filters;
    const { start, end } = buildDateRange(year, month);

    const filter: Record<string, unknown> = {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    };

    if (type) filter.type = type;
    if (paid) filter.paid = { $regex: paid, $options: 'i' };
    if (description) filter.description = { $regex: description, $options: 'i' };

    if (minValue !== undefined || maxValue !== undefined) {
      const valueFilter: Record<string, number> = {};
      if (minValue !== undefined) valueFilter.$gte = minValue;
      if (maxValue !== undefined) valueFilter.$lte = maxValue;
      filter.value = valueFilter;
    }

    return findMany(BillModel, filter);

  }
}
