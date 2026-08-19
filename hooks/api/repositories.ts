import { BillsRepository, ExpensesRepository, FuelRepository, RevenuesRepository, SalesRepository, UserRepository } from '@/lib/db';

export function useRepository() {
    return {    
        billsRepository: new BillsRepository(),
        expensesRepository: new ExpensesRepository(),
        fuelRepository: new FuelRepository(),
        revenuesRepository: new RevenuesRepository(),
        salesRepository: new SalesRepository(),
        userRepository: new UserRepository(),
    };
}