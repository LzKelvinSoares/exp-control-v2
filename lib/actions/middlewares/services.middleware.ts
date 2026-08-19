import { NextRequest, NextResponse } from 'next/server';
import { IServicesContext, useServices } from '@/hooks/api';

type ServicesHandler = (req: NextRequest, services: IServicesContext) => Promise<NextResponse>;

export function withServices(handler: ServicesHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const services = useServices();
    return handler(req, services);
  }
}