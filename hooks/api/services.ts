import { BillsService, ChartService, ExpensesService, RevenuesService } from '@/lib/actions/services';

export function useServices() {
    return {    
        billsService: new BillsService(),
        expensesService: new ExpensesService(),
        revenuesService: new RevenuesService(),
        chartService: new ChartService(),
    };
}