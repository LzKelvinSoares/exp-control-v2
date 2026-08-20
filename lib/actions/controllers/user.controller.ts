import { useRepositories } from '@/hooks/api';
import { ok } from '../services';
import { withServices } from '../middlewares';

export function createUserRoutes() {
    return {
        GET: withServices(async (_req, ctx, { userService }) => {
            const points = await userService.get(_req, ctx);
            return ok({ points });
        })
    }
}