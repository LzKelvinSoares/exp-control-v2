import { useServices } from '@/hooks/api';
import { err, ok } from '../services';
import { NextRequest } from 'next/server';
import { AuthContext } from '@/types/server-types';
import { withAuth } from '../middlewares';

export function createSalesRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { salesService } = useServices();
            return ok(await salesService.get(req, ctx));
        }),
        POST: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            const { salesService } = useServices();
            return ok(await salesService.create(req, ctx));
        }),
        PUT: withAuth(async (req: NextRequest, _ctx) => {
            const { salesService } = useServices();
            const { id } = await req.json();
            if (!id) return err('id is required');
            return ok(await salesService.update(req));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx) => {
            const { salesService } = useServices();
            const { id } = await req.json();
            if (!id) return err('id is required');
            await salesService.delete(id);
            return ok({ success: true });
        })
    }
}