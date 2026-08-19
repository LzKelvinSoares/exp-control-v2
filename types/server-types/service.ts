import { NextRequest } from 'next/server';

export interface AuthContext {
  userId: string
  currency: string
}

export interface IBudgetService<T> {
    get(req: NextRequest, ctx: AuthContext): Promise<T[]>;
    create(req: NextRequest, ctx: AuthContext): Promise<T[]>;
    update(req: NextRequest): Promise<T>;
    delete(id: string): Promise<void>;
}