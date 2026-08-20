import { BillsService, ChartService, ExpensesService, FuelService, IBillsService, RevenuesService, SalesService, UserService } from '@/lib/actions/services';
import { Budget, Expense, Fuel, MonthlyChartData, Sale } from '@/types/app-types';
import { HasPoints, IReadService, ITableCrudService, ITableReadAndUpdateService } from '@/types/server-types';
import { useRepositories } from './repositories';

export interface IServicesContext {
    billsService: IBillsService;
    expensesService: ITableCrudService<Expense, Expense>;
    revenuesService: ITableCrudService<Budget, Budget>;
    chartService: IReadService<MonthlyChartData>;
    fuelService: ITableCrudService<Fuel, Fuel>;
    salesService: ITableCrudService<Sale, Sale>;
    userService: ITableReadAndUpdateService<number, HasPoints>;
}

export function useServices() {
    const {
        billsRepository,
        expensesRepository,
        revenuesRepository,
        fuelRepository,
        salesRepository,
        userRepository
    } = useRepositories();

    return {    
        billsService: new BillsService(billsRepository, expensesRepository, userRepository),
        expensesService: new ExpensesService(expensesRepository),
        revenuesService: new RevenuesService(revenuesRepository),
        chartService: new ChartService(expensesRepository, revenuesRepository, fuelRepository),
        fuelService: new FuelService(fuelRepository),
        salesService: new SalesService(salesRepository),
        userService: new UserService(userRepository),
    };
}