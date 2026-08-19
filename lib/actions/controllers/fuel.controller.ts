import { err, ok } from '../services';
import { NextRequest } from 'next/server';
import { withServices } from '../middlewares';

export function createFuelRoutes() {
    return {
        GET: withServices(async (req, { fuelService }, ctx) => {
            return ok(await fuelService.get(req, ctx));
        }),
        POST: withServices(async (req: NextRequest, { fuelService }, ctx) => {
            return ok(await fuelService.create(req, ctx));
        }),
        PUT: withServices(async (req: NextRequest, { fuelService }, _ctx) => {
            const { id } = await req.json();
            if (!id) return err('id is required');
            return ok(await fuelService.update(req));
        }),
        DELETE: withServices(async (req: NextRequest, { fuelService }, _ctx) => {
            const { id } = await req.json();
            if (!id) return err('id is required');
            await fuelService.delete(id);
            return ok({ success: true });
        })
    }
}