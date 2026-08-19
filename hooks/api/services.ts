import { BillsService, ChartService, ExpensesService, RevenuesService, SalesService } from '@/lib/actions/services';

export function useServices() {
    return {    
        billsService: new BillsService(),
        expensesService: new ExpensesService(),
        revenuesService: new RevenuesService(),
        chartService: new ChartService(),
        salesService: new SalesService(),
    };
}