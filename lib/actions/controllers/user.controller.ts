import { useRepository } from '@/hooks/api';
import { ok, withAuth } from '../services';

export function createUserRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { userRepository } = useRepository();
            const points = await userRepository.getUserPoints(ctx.userId);
            return ok({ points });
        })
    }
}