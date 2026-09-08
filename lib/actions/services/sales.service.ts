import { Sale } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { AuthContext, ITableCrudRepository, ITableCrudService } from '@/types/server-types';

export class SalesService implements ITableCrudService<Sale, Sale> {
    constructor(private salesRepository: ITableCrudRepository<Sale>) {
    }

    async get(_req: NextRequest, ctx: AuthContext): Promise<Sale[]> {
        return await this.salesRepository.getAllByCurrency?.(ctx.currency) || [];
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Sale[]> {
        const body = await req.json();
        return await this.salesRepository.create({ ...body, currencyCurrencyAccount: ctx.currency }) as Sale[];
    }
    async update(item: Sale, ctx: AuthContext): Promise<Sale> {
        const { id, ...body } = item;
        if (!id) throw new Error('id is required');
        return await this.salesRepository.update(id, {
            ...body,
            currencyCurrencyAccount: ctx.currency,
        });
    }
    async delete(id: string): Promise<void> {
        await this.salesRepository.delete(id);
    }

}