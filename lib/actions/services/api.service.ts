import { auth } from '@/lib/actions/services/auth.service'
import { AuthContext, HasId, ITableCrudService, ITableReadAndUpdateService } from '@/types/server-types'
import { NextRequest, NextResponse } from 'next/server'

export async function getAuthContext(): Promise<AuthContext | NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return {
    userId: session.user.id,
    currency: session.user.currentCurrency ?? 'BRL',
  }
}

export function ok<T>(data: T) {
  return NextResponse.json(data)
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function isAuthContext(val: unknown): val is AuthContext {
  return typeof val === 'object' && val !== null && 'userId' in val
}

export function buildInternalRequest<T>(url: string, method: string, body?: T): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function executeUpdateWithIdValidation<T, R extends HasId>(
  req: NextRequest,
  ctx: AuthContext,
  service: ITableReadAndUpdateService<T, R>
) {
  const item = await req.json();
  if (!item.id) return err('id is required');
  return ok(await service.update(item, ctx));
}

export async function executeDeleteWithIdValidation<T, R extends HasId>(
  req: NextRequest,
  ctx: AuthContext,
  service: ITableCrudService<T, R>
) {
  const { id } = await req.json();
  if (!id) return err('id is required');
  await service.delete(id);
  return ok({ success: true });
}
