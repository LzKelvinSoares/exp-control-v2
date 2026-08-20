import { Budget } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { getMonthYearParams } from './params.service';
import { AuthContext, IFullTableCrudRepository, ITableCrudService } from '@/types/server-types';

export class RevenuesService implements ITableCrudService<Budget, Budget> {
    
    constructor(private revenuesRepository: IFullTableCrudRepository<Budget>) {
    }

    async get(req: NextRequest, ctx: AuthContext): Promise<Budget[]> {
        const { month, year } = getMonthYearParams(req);
        return await this.revenuesRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Budget[]> {
        const body = await req.json()
        return await this.revenuesRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }) as Budget[];
    }
    async update(item: Budget): Promise<Budget> {
        const { id, ...body } = item;
        if (!id) throw new Error('id is required');
        return await this.revenuesRepository.update(id, body as Partial<Budget>);
    }
    async delete(id: string): Promise<void> {
        await this.revenuesRepository.delete(id);
    }

}