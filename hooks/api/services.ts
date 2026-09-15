import { BillsService, ChartService, ExpensesService, FuelService, IBillsService, RevenuesService, SalesService, UserService } from '@/lib/actions/services';
import { Budget, Expense, Fuel, MonthlyChartData, Sale } from '@/types/app-types';
import { HasPoints, IReadService, ITableCrudService, ITableReadAndUpdateService } from '@/types/server-types';
import { useRepositories } from './repositories';
import { AIContextService, ChatService, IAIContextService, IChatService } from '@/lib/actions/services/mcp';
import { useAIContextService } from './ai-context-services';

export interface IServicesContext {
    aiContextService: IAIContextService;
    billsService: IBillsService;
    expensesService: ITableCrudService<Expense, Expense>;
    revenuesService: ITableCrudService<Budget, Budget>;
    chartService: IReadService<MonthlyChartData>;
    chatService: IChatService;
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

    const {
        billsContextService,
        expensesContextService,
        fuelContextService,
        revenuesContextService,
        salesContextService
    } = useAIContextService();
    
    const chatService = new ChatService(
        billsContextService,
        expensesContextService,
        fuelContextService,
        revenuesContextService,
        salesContextService
    );

    return {
        aiContextService: new AIContextService(chatService),
        billsService: new BillsService(billsRepository, expensesRepository, userRepository),
        expensesService: new ExpensesService(expensesRepository),
        revenuesService: new RevenuesService(revenuesRepository),
        chartService: new ChartService(expensesRepository, revenuesRepository, fuelRepository),
        chatService,
        fuelService: new FuelService(fuelRepository),
        salesService: new SalesService(salesRepository),
        userService: new UserService(userRepository),
    };
}