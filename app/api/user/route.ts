import { withAuth, ok } from '@/lib/api'
import { useService } from '@/lib/providers/service-provider';

export const GET = withAuth(async (_req, ctx) => {
  const { userService } = useService();
  const points = await userService.getUserPoints(ctx.userId);
  return ok({ points });
})
