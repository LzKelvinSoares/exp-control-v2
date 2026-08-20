import { Fuel } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { AuthContext, IFullTableCrudRepository, ITableCrudService } from '@/types/server-types';
import { getMonthYearParams } from './params.service';

export class FuelService implements ITableCrudService<Fuel, Fuel> {
    constructor(private fuelRepository: IFullTableCrudRepository<Fuel>) {
    }

    async get(req: NextRequest, ctx: AuthContext): Promise<Fuel[]> {
        const { month, year } = getMonthYearParams(req);
        return await this.fuelRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Fuel[]> {
        const body = await req.json();
        return await this.fuelRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }) as Fuel[];
    }
    async update(item: Fuel): Promise<Fuel> {
        const { id, ...body } = item;
        if (!id) throw new Error('id is required');
        return await this.fuelRepository.update(id, body);
    }
    async delete(id: string): Promise<void> {
        await this.fuelRepository.delete(id);
    }

}