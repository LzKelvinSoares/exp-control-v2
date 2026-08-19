import { NextRequest } from 'next/server';

export interface AuthContext {
  userId: string
  currency: string
}

export interface IReadService<T> {
    get(req: NextRequest, ctx: AuthContext): Promise<T[]>;
}

export interface ICreateService<T> {
    create(req: NextRequest, ctx: AuthContext): Promise<T | T[]>;
}

export interface IUpdateService<T> {
    update(req: NextRequest): Promise<T>;
}

export interface IDeleteService {
    delete(id: string): Promise<void>;
}

export interface ITableCrudService<T> extends IReadService<T>, ICreateService<T>, IUpdateService<T>, IDeleteService {}