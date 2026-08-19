import { useRepository } from '@/hooks/api';
import { ok } from '../services';
import { withAuth } from '../middlewares';

export function createUserRoutes() {
    return {
        GET: withAuth(async (_req, ctx) => {
            const { userRepository } = useRepository();
            const points = await userRepository.getUserPoints(ctx.userId);
            return ok({ points });
        })
    }
}