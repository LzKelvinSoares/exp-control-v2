import { BillsService, ChartService, ExpensesService, FuelService, RevenuesService, SalesService } from '@/lib/actions/services';

export function useServices() {
    return {    
        billsService: new BillsService(),
        expensesService: new ExpensesService(),
        revenuesService: new RevenuesService(),
        chartService: new ChartService(),
        fuelService: new FuelService(),
        salesService: new SalesService(),
    };
}