import { BillsService, ChartService, ExpensesService, FuelService, IBillsService, RevenuesService, SalesService } from '@/lib/actions/services';
import { Budget, Expense, Fuel, MonthlyChartData, Sale } from '@/types/app-types';
import { IReadService, ITableCrudService } from '@/types/server-types';

export interface IServicesContext {
    billsService: IBillsService;
    expensesService: ITableCrudService<Expense>;
    revenuesService: ITableCrudService<Budget>;
    chartService: IReadService<MonthlyChartData>;
    fuelService: ITableCrudService<Fuel>;
    salesService: ITableCrudService<Sale>;
}

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