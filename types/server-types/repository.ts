export interface IGetByYearProps {
    userId: string;
    currency: string;
    year: number; 
}

export interface IGetByMonthAndYearProps extends IGetByYearProps {
    month: number;
}

export interface IReadRepository<T> {
    getAll?: () => Promise<T[]>;
}

export interface IReadPerYearRepository<T> {
    getByMonthAndYear: (props: IGetByMonthAndYearProps) => Promise<T[]>;
    getByYear: (props: IGetByYearProps) => Promise<T[]>
}

export interface IWriteRepository<T> {
    create: (data: T) => Promise<T[]>;
    update: (id: string, data: Partial<T>) => Promise<T>;
}

export interface IDeleteRepository {
    delete: (id: string) => Promise<void>;
}

export type ITableCrudRepository<T> =  IReadRepository<T> & IWriteRepository<T> & IDeleteRepository;
export type IFullTableCrudRepository<T> =  IReadPerYearRepository<T> & ITableCrudRepository<T>;