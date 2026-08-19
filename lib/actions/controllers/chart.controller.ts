import { useServices } from '@/hooks/api';
import { ok } from '../services';
import { withAuth } from '../middlewares';

export function createChartRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { chartService } = useServices();
            return ok(await chartService.get(req, ctx));
        })
    }
}