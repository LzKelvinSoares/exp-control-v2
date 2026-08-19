import { NextRequest, NextResponse } from 'next/server';
import { IServicesContext, useServices } from '@/hooks/api';
import { AuthContext } from '@/types/server-types';
import { withAuth } from './auth.middleware';

type ServicesHandler = (
  req: NextRequest,
  services: IServicesContext,
  ctx: AuthContext
) => Promise<NextResponse>;

export function withServices(handler: ServicesHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const services = useServices();

    // withAuth only knows about (req, ctx), so close over `services` here
    const authed = withAuth((req, ctx) => handler(req, services, ctx));

    return authed(req);
  };
}