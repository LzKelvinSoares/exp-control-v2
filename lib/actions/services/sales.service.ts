import { Sale } from '@/types/app-types';
import { NextRequest } from 'next/server';
import { ITableCrudRepository, ITableCrudService } from '@/types/server-types';

export class SalesService implements ITableCrudService<Sale, Sale> {
    constructor(private salesRepository: ITableCrudRepository<Sale>) {
    }

    async get(): Promise<Sale[]> {
        return await this.salesRepository.getAll?.() || [];
    }
    async create(req: NextRequest): Promise<Sale[]> {
        const body = await req.json();
        return await this.salesRepository.create(body) as Sale[];
    }
    async update(item: Sale): Promise<Sale> {
        const { id, ...body } = item;
        if (!id) throw new Error('id is required');
        return await this.salesRepository.update(id, body as Partial<Sale>);
    }
    async delete(id: string): Promise<void> {
        await this.salesRepository.delete(id);
    }

}