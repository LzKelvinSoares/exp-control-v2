import RevenueModel from '@/models/Revenue'
import { findMany, createMany, updateOne, deleteOne } from './crud'
import { Budget } from '@/types/app-types'
import { IGetByMonthAndYearProps, IGetByYearProps, IFullTableCrudService } from '@/types/server-types';

export class RevenuesService implements IFullTableCrudService<Budget> {
  async getByMonthAndYear({ userId, currency, month, year }: IGetByMonthAndYearProps) {
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 1).toISOString();
    return findMany(RevenueModel, {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    });
  }

  async getByYear({ userId, currency, year }: IGetByYearProps) {
    const start = new Date(year, 0, 1).toISOString();
    const end = new Date(year + 1, 0, 1).toISOString();
    return findMany(RevenueModel, {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    });
  }

  async create(data: Omit<Budget, 'id' | 'creationDate'>): Promise<Budget[]> {
    const { monthsLeft = 1, ...rest } = data;
    const baseDate = new Date(rest.firstExpirationDate as string);

    const records: Partial<Budget>[] = Array.from({ length: monthsLeft }, (_, i) => {
      const expDate = new Date(baseDate)
      expDate.setMonth(expDate.getMonth() + i)
      return { ...rest, firstExpirationDate: expDate.toISOString(), monthsLeft }
    });

    if (records.length > 1) {
      const [parent, ...children] = await createMany(RevenueModel, records);
      const parentId = parent.id!;
      await Promise.all(
        children.map((c) =>
          updateOne(RevenueModel, c.id!, { parentBudgetId: parentId })
        )
      );
      return [parent, ...children] as Budget[];
    }

    return createMany(RevenueModel, records);
  }

  async update(id: string, data: Partial<Budget>) {
    return updateOne(RevenueModel, id, data)
  }

  async delete(id: string){
    return deleteOne(RevenueModel, id)
  }
}
