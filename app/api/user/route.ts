import { useService } from '@/hooks/api';
import { withAuth, ok } from '@/lib/api'

export const GET = withAuth(async (_req, ctx) => {
  const { userService } = useService();
  const points = await userService.getUserPoints(ctx.userId);
  return ok({ points });
})
