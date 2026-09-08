import { BillsRepository, ExpensesRepository, FuelRepository, IBillsRepository, IUserRepository, RevenuesRepository, SalesRepository, UserRepository } from '@/lib/db';
import { Budget, Expense, Fuel, Sale } from '@/types/app-types';
import { IFullMCPQueryRepository, IMCPQueryRepository } from '@/types/server-types';

export interface IRepositoriesContext {
    billsRepository: IBillsRepository;
    expensesRepository: IFullMCPQueryRepository<Expense>;
    revenuesRepository: IFullMCPQueryRepository<Budget>;
    fuelRepository: IFullMCPQueryRepository<Fuel>;
    salesRepository: IMCPQueryRepository<Sale>;
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