export interface IGetByYearProps {
    userId: string;
    currency: string;
    year: number; 
}

export interface QueryFilters {
  year: number
  month?: number
  type?: string
  responsible?: string
  description?: string
  minValue?: number
  maxValue?: number
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

export interface IQueryWithFiltersRepository<T> {
    queryWithFilters: (userId: string, currency: string, filters: QueryFilters) => Promise<T[]>;
}

export interface IWriteRepository<T> {
    create: (data: T) => Promise<T[] | T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
}

export interface IDeleteRepository {
    delete: (id: string) => Promise<void>;
}

export type ITableCrudRepository<T> =  IReadRepository<T> & IWriteRepository<T> & IDeleteRepository;
export type IFullTableCrudRepository<T> =  IReadPerYearRepository<T> & ITableCrudRepository<T>;
export type IMCPQueryRepository<T> = IFullTableCrudRepository<T> & IQueryWithFiltersRepository<T>;