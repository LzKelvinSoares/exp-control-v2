import { useServices } from '@/hooks/api';
import { ok, withAuth } from '../services';

export function createChartRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { chartService } = useServices();
            return ok(await chartService.get(req, ctx));
        })
    }
}