import { err, executeDeleteWithIdValidation, executeUpdateWithIdValidation, ok } from '../services';
import { NextRequest } from 'next/server';
import { AuthContext } from '@/types/server-types';
import { withServices } from '../middlewares';

export function createSalesRoutes() {
    return {
        GET: withServices(async (req, ctx, { salesService }) => {
            return ok(await salesService.get(req, ctx));
        }),
        POST: withServices(async (req: NextRequest, ctx: AuthContext, { salesService }) => {
            return ok(await salesService.create(req, ctx));
        }),
        PUT: withServices(async (req: NextRequest, ctx: AuthContext, { salesService }) => {
            return executeUpdateWithIdValidation(req, ctx, salesService);
        }),
        DELETE: withServices(async (req: NextRequest, ctx: AuthContext, { salesService }) => {
           return executeDeleteWithIdValidation(req, ctx, salesService);
        })
    }
}