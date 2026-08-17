import { BillsService, ExpensesService, FuelService, RevenuesService, SalesService, UserService } from '@/lib/db';

export function useService() {
    return {    
        billsService: new BillsService(),
        expensesService: new ExpensesService(),
        fuelService: new FuelService(),
        revenuesService: new RevenuesService(),
        salesService: new SalesService(),
        userService: new UserService(),
    };
}