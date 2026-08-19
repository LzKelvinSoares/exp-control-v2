import { ok } from '../services';
import {  withServices } from '../middlewares';

export function createChartRoutes() {
    return {
        GET: withServices(async (req, { chartService }, ctx) => {
            return ok(await chartService.get(req, ctx));
        })
    }
}