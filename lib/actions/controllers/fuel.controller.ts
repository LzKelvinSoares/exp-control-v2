import { useRepository, useServices } from '@/hooks/api';
import { err, ok } from '../services';
import { NextRequest } from 'next/server';
import { withAuth } from '../middlewares';

export function createFuelRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { fuelService } = useServices();
            return ok(await fuelService.get(req, ctx));
        }),
        POST: withAuth(async (req: NextRequest, ctx) => {
            const { fuelService } = useServices();
            return ok(await fuelService.create(req, ctx));
        }),
        PUT: withAuth(async (req: NextRequest, _ctx) => {
            const { fuelService } = useServices();
            const { id } = await req.json();
            if (!id) return err('id is required');
            return ok(await fuelService.update(req));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx) => {
            const { fuelService } = useServices();
            const { id } = await req.json();
            if (!id) return err('id is required');
            await fuelService.delete(id);
            return ok({ success: true });
        })
    }
}