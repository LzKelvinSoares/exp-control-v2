import { BillsContextService, ExpensesContextService, FuelContextService, RevenuesContextService, SalesContextService } from '@/lib/actions/services/mcp/context';
import { Bill, Budget, Expense, Fuel, Sale } from '@/types/app-types';
import { IChatContextService } from '@/types/server-types';
import { useRepositories } from './repositories';

export interface IAIContextServiceContext {
    billsContextService: IChatContextService<Bill>;
    expensesContextService: IChatContextService<Expense>;
    revenuesContextService: IChatContextService<Budget>;
    fuelContextService: IChatContextService<Fuel>;
    salesContextService: IChatContextService<Sale>;
}

export function useAIContextService(): IAIContextServiceContext {
    const {
        billsRepository,
        expensesRepository,
        revenuesRepository,
        fuelRepository,
        salesRepository,
        userRepository
    } = useRepositories();

    return {    
        billsContextService: new BillsContextService(billsRepository, expensesRepository, userRepository),
        expensesContextService: new ExpensesContextService(expensesRepository),
        fuelContextService: new FuelContextService(fuelRepository),
        revenuesContextService: new RevenuesContextService(revenuesRepository),
        salesContextService: new SalesContextService(salesRepository)
    };
}