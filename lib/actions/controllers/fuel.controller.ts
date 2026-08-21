import { executeDeleteWithIdValidation, executeUpdateWithIdValidation, ok } from '../services';
import { NextRequest } from 'next/server';
import { withServices } from '../middlewares';

export function createFuelRoutes() {
    return {
        GET: withServices(async (req, ctx, { fuelService }) => {
            return ok(await fuelService.get(req, ctx));
        }),
        POST: withServices(async (req: NextRequest, ctx, { fuelService }) => {
            return ok(await fuelService.create(req, ctx));
        }),
        PUT: withServices(async (req: NextRequest, ctx, { fuelService }) => {
            return executeUpdateWithIdValidation(req, ctx, fuelService);
        }),
        DELETE: withServices(async (req: NextRequest, ctx, { fuelService }) => {
           return executeDeleteWithIdValidation(req, ctx, fuelService);
        })
    }
}