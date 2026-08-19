import { AuthContext } from '@/types/server-types';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext, isAuthContext } from '../services';

type AuthHandler = (req: NextRequest, ctx: AuthContext) => Promise<NextResponse>;

export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const ctx = await getAuthContext();
    if (!isAuthContext(ctx)) return ctx;
    return handler(req, ctx);
  }
}