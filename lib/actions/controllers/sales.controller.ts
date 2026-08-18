import { useRepository } from '@/hooks/api';
import { err, ok, withAuth } from '../services';
import { NextRequest } from 'next/server';

export function createSalesRoutes() {
    return {
        GET: withAuth(async (_req, _ctx) => {
            const { salesRepository } = useRepository();
            return ok(await salesRepository.getAll?.());
        }),
        POST: withAuth(async (req: NextRequest, _ctx) => {
            const { salesRepository } = useRepository();
            const body = await req.json();
            return ok(await salesRepository.create(body));
        }),
        PUT: withAuth(async (req: NextRequest, _ctx) => {
            const { salesRepository } = useRepository();
            const { id, ...body } = await req.json();
            if (!id) return err('id is required');
            return ok(await salesRepository.update(id, body));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx) => {
            const { salesRepository } = useRepository();
            const { id } = await req.json();
            if (!id) return err('id is required');
            await salesRepository.delete(id);
            return ok({ success: true });
        })
    }
}