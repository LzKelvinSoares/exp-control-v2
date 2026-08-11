import { withAuth, ok } from '@/lib/api'
import { getUserPoints } from '@/lib/db/users'

export const GET = withAuth(async (_req, ctx) => {
  const points = await getUserPoints(ctx.userId)
  return ok({ points })
})
