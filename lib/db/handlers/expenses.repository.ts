import ExpenseModel from '@/models/Expense'
import { findMany, createMany, updateOne, deleteOne } from '../crud'
import { Expense } from '@/types/app-types'
import { IGetByMonthAndYearProps, IGetByYearProps, IFullTableCrudRepository, QueryFilters } from '@/types/server-types'

export class ExpensesRepository implements IFullTableCrudRepository<Expense> {
  async getByMonthAndYear({ userId, currency, month, year }: IGetByMonthAndYearProps) {
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 1).toISOString()
    return findMany(ExpenseModel, {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    })
  }

  async getByYear({ userId, currency, year }: IGetByYearProps) {
    const start = new Date(year, 0, 1).toISOString()
    const end = new Date(year + 1, 0, 1).toISOString()
    return findMany(ExpenseModel, {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    })
  }

  async create(data: Omit<Expense, 'id' | 'creationDate'>): Promise<Expense[]> {
    const { monthsLeft = 1, ...rest } = data;
    const baseDate = new Date(rest.firstExpirationDate as string);

    const records: Partial<Expense>[] = Array.from({ length: monthsLeft }, (_, i) => {
      const expDate = new Date(baseDate)
      expDate.setMonth(expDate.getMonth() + i)
      return { ...rest, firstExpirationDate: expDate.toISOString(), monthsLeft }
    });

    if (records.length > 1) {
      const [parent, ...children] = await createMany(ExpenseModel, records);
      const parentId = parent.id!;
      await Promise.all(
        children.map((c) =>
          updateOne(ExpenseModel, c.id!, { parentBudgetId: parentId })
        )
      );
      return [parent, ...children] as Expense[];
    }

    return createMany(ExpenseModel, records);
  }

  async update(id: string, data: Partial<Expense>) {
    return updateOne(ExpenseModel, id, data)
  }

  async delete(id: string){
    return deleteOne(ExpenseModel, id)
  }

  private buildDateRange(year: number, month?: number): { start: string; end: string } {
    return month
      ? { start: new Date(year, month - 1, 1).toISOString(), end: new Date(year, month, 1).toISOString() }
      : { start: new Date(year, 0, 1).toISOString(), end: new Date(year + 1, 0, 1).toISOString() }
  }

  async queryWithFilters(userId: string, currency: string, filters: QueryFilters): Promise<Expense[]> {
    const { year, month, type, responsible, description, minValue, maxValue } = filters
    const { start, end } = this.buildDateRange(year, month)

    const filter: Record<string, unknown> = {
      userId,
      currencyCurrencyAccount: currency,
      firstExpirationDate: { $gte: start, $lt: end },
    }

    if (type) filter.type = type
    if (responsible) filter.responsible = { $regex: responsible, $options: 'i' }
    if (description) filter.description = { $regex: description, $options: 'i' }

    if (minValue !== undefined || maxValue !== undefined) {
      const valueFilter: Record<string, number> = {}
      if (minValue !== undefined) valueFilter.$gte = minValue
      if (maxValue !== undefined) valueFilter.$lte = maxValue
      filter.value = valueFilter
    }

    return findMany(ExpenseModel, filter)
  }
}