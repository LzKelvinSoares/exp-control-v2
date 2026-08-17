import { NextRequest } from 'next/server'
import { withAuth, ok, err } from '@/lib/api'
import { useService } from '@/hooks/api';

export const GET = withAuth(async (_req, _ctx) => {
  const { salesService } = useService();
  return ok(await salesService.getAll?.());
})

export const POST = withAuth(async (req: NextRequest, _ctx) => {
  const { salesService } = useService();
  const body = await req.json();
  return ok(await salesService.create(body));
})

export const PUT = withAuth(async (req: NextRequest, _ctx) => {
  const { salesService } = useService();
  const { id, ...body } = await req.json();
  if (!id) return err('id is required');
  return ok(await salesService.update(id, body));
})

export const DELETE = withAuth(async (req: NextRequest, _ctx) => {
  const { salesService } = useService();
  const { id } = await req.json();
  if (!id) return err('id is required');
  await salesService.delete(id);
  return ok({ success: true });
})
