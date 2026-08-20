import { ok } from '../services';
import {  withServices } from '../middlewares';

export function createChartRoutes() {
    return {
        GET: withServices(async (req, ctx, { chartService }) => {
            return ok(await chartService.get(req, ctx));
        })
    }
}