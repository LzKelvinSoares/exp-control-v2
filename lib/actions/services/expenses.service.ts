import { Expense } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { getMonthYearParams } from './params.service';
import { AuthContext, IFullTableCrudRepository, ITableCrudService, HasId } from '@/types/server-types';

export class ExpensesService implements ITableCrudService<Expense, Expense> {
    constructor(private expensesRepository: IFullTableCrudRepository<Expense>) {
    }
    async get(req: NextRequest, ctx: AuthContext): Promise<Expense[]> {
        const { month, year } = getMonthYearParams(req);
        return await this.expensesRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Expense[]> {
        const body = await req.json();
        return await this.expensesRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }) as Expense[];
    }
    async update(item: Expense): Promise<Expense> {
        const { id, ...body } = item;
        if (!id) throw new Error('id is required');
        return await this.expensesRepository.update(id, body as Partial<Expense>);
    }
    async delete(id: string): Promise<void> {
        await this.expensesRepository.delete(id);
    }

}