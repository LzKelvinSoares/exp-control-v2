import { BillsRepository, ExpensesRepository, FuelRepository, IBillsRepository, IUserRepository, RevenuesRepository, SalesRepository, UserRepository } from '@/lib/db';
import { Budget, Expense, Fuel, Sale } from '@/types/app-types';
import { IFullTableCrudRepository, IMCPQueryRepository, ITableCrudRepository } from '@/types/server-types';

export interface IRepositoriesContext {
    billsRepository: IBillsRepository;
    expensesRepository: IMCPQueryRepository<Expense>;
    revenuesRepository: IMCPQueryRepository<Budget>;
    fuelRepository: IFullTableCrudRepository<Fuel>;
    salesRepository: ITableCrudRepository<Sale>;
    userRepository: IUserRepository;
}

export function useRepositories(): IRepositoriesContext {
    return {    
        billsRepository: new BillsRepository(),
        expensesRepository: new ExpensesRepository(),
        fuelRepository: new FuelRepository(),
        revenuesRepository: new RevenuesRepository(),
        salesRepository: new SalesRepository(),
        userRepository: new UserRepository(),
    };
}