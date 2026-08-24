import { NextRequest } from 'next/server';
import { ToolInput } from './chat';

export interface HasId {
    id?: string;
} 

export interface HasPoints extends HasId {
    points: number;
}

export interface AuthContext {
  userId: string
  currency: string
}

export interface IReadService<T> {
    get(req: NextRequest, ctx: AuthContext): Promise<T | T[]>;
}

export interface ICreateService<T> {
    create(req: NextRequest, ctx: AuthContext): Promise<T | T[]>;
}

export interface IUpdateService<T, R extends HasId> {
    update(item: R, ctx: AuthContext): Promise<T>;
}

export interface IDeleteService {
    delete(id: string): Promise<void>;
}

export interface ToolCallProps {
  toolName: string;
  toolInput: ToolInput;
  userId: string;
  currency: string;
}

export interface ITableReadAndUpdateService<T, R extends HasId> extends IReadService<T>, IUpdateService<T, R> {}
export interface ITableCrudService<T, R extends HasId> extends ITableReadAndUpdateService<T, R>, ICreateService<T>, IDeleteService {}