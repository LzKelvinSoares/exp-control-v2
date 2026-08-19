import { Expense } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { getMonthYearParams } from './params.service';
import { useRepository } from '@/hooks/api';
import { AuthContext, IBudgetService } from '@/types/server-types';

export class ExpensesService implements IBudgetService<Expense> {
    async get(req: NextRequest, ctx: AuthContext): Promise<Expense[]> {
        const { expensesRepository } = useRepository();
        const { month, year } = getMonthYearParams(req);
        return await expensesRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Expense[]> {
        const { expensesRepository } = useRepository();
        const body = await req.json()
        return await expensesRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency });
    }
    async update(req: NextRequest): Promise<Expense> {
        const { expensesRepository } = useRepository();
        const { id, ...body } = await req.json();
        if (!id) throw new Error('id is required');
        return await expensesRepository.update(id, body as Partial<Expense>);
    }
    async delete(id: string): Promise<void> {
        const { expensesRepository } = useRepository();
        await expensesRepository.delete(id);
    }

}