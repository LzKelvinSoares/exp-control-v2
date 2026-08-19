import { BillsService, ExpensesService, RevenuesService } from '@/lib/actions/services';

export function useServices() {
    return {    
        billsService: new BillsService(),
        expensesService: new ExpensesService(),
        revenuesService: new RevenuesService(),
    };
}