import { auth } from '@/lib/actions/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export interface AuthContext {
  userId: string
  currency: string
}

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

type AuthHandler = (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>

export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const ctx = await getAuthContext()
    if (!isAuthContext(ctx)) return ctx
    return handler(req, ctx)
  }
}
