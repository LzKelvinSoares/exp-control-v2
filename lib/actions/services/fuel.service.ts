import { Fuel } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { useRepository } from '@/hooks/api';
import { AuthContext, ITableCrudService } from '@/types/server-types';
import { getMonthYearParams } from './params.service';

export class FuelService implements ITableCrudService<Fuel> {
    async get(req: NextRequest, ctx: AuthContext): Promise<Fuel[]> {
        const { fuelRepository } = useRepository();
        const { month, year } = getMonthYearParams(req);
        return await fuelRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Fuel[]> {
        const { fuelRepository } = useRepository();
        const body = await req.json();
        return await fuelRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency });
    }
    async update(req: NextRequest): Promise<Fuel> {
        const { fuelRepository } = useRepository();
        const { id, ...body } = await req.json();
        return await fuelRepository.update(id, body);
    }
    async delete(id: string): Promise<void> {
        const { fuelRepository } = useRepository();
        await fuelRepository.delete(id);
    }

}