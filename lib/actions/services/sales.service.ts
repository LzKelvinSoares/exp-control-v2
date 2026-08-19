import { Sale } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { useRepository } from '@/hooks/api';
import { AuthContext, ITableCrudService } from '@/types/server-types';

export class SalesService implements ITableCrudService<Sale> {
    async get(_req: NextRequest, _ctx: AuthContext): Promise<Sale[]> {
        const { salesRepository } = useRepository();
        return await salesRepository.getAll?.();
    }
    async create(req: NextRequest, ctx: AuthContext): Promise<Sale[]> {
        const { salesRepository } = useRepository();
        const body = await req.json();
        return await salesRepository.create(body);
    }
    async update(req: NextRequest): Promise<Sale> {
        const { salesRepository } = useRepository();
        const { id, ...body } = await req.json();
        return await salesRepository.update(id, body as Partial<Sale>);
    }
    async delete(id: string): Promise<void> {
        const { salesRepository } = useRepository();
        await salesRepository.delete(id);
    }

}