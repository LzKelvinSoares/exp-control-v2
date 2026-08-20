import { NextRequest, NextResponse } from 'next/server';
import { IServicesContext, useRepositories, useServices } from '@/hooks/api';
import { AuthContext } from '@/types/server-types';
import { withAuth } from './auth.middleware';

type ServicesHandler = (
  req: NextRequest,
  ctx: AuthContext,
  services: IServicesContext
) => Promise<NextResponse>;

export function withServices(handler: ServicesHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const services = useServices();

    // withAuth only knows about (req, ctx), so close over `services` here
    const authed = withAuth((req, ctx) => handler(req, ctx, services));

    return authed(req);
  };
}