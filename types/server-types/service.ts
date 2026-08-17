import { Currency } from '../app-types';

export interface IGetByYearProps {
    userId: string;
    currency: string;
    year: number; 
}

export interface IGetByMonthAndYearProps extends IGetByYearProps {
    month: number;
}

export interface IReadService<T> {
    getAll?: () => Promise<T[]>;
}

export interface IReadPerYearService<T> {
    getByMonthAndYear: (props: IGetByMonthAndYearProps) => Promise<T[]>;
    getByYear: (props: IGetByYearProps) => Promise<T[]>
}

export interface IWriteService<T> {
    create: (data: T) => Promise<T[]>;
    update: (id: string, data: Partial<T>) => Promise<T>;
}

export interface IDeleteService {
    delete: (id: string) => Promise<void>;
}

export type ITableCrudService<T> =  IReadService<T> & IWriteService<T> & IDeleteService;
export type IFullTableCrudService<T> =  IReadPerYearService<T> & ITableCrudService<T>;