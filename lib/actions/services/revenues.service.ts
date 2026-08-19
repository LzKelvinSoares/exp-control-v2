import { Budget } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { getMonthYearParams } from './params.service';
import { useRepository } from '@/hooks/api';
import { AuthContext, ITableCrudService } from '@/types/server-types';

export class RevenuesService implements ITableCrudService<Budget> {
    async get(req: NextRequest, ctx: AuthContext): Promise<Budget[]> {
        const { revenuesRepository } = useRepository();
        const { month, year } = getMonthYearParams(req);
        return await revenuesRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Budget[]> {
        const { revenuesRepository } = useRepository();
        const body = await req.json()
        return await revenuesRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency });
    }
    async update(req: NextRequest): Promise<Budget> {
        const { revenuesRepository } = useRepository();
        const { id, ...body } = await req.json();
        if (!id) throw new Error('id is required');
        return await revenuesRepository.update(id, body as Partial<Budget>);
    }
    async delete(id: string): Promise<void> {
        const { revenuesRepository } = useRepository();
        await revenuesRepository.delete(id);
    }

}