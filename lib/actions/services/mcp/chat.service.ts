import { BILLS_EXPENSE_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories';
import { POINTS } from '@/constants/levels';
import { IMCPQueryRepository, ToolCallProps, ToolInput, IFullMCPQueryRepository } from '@/types/server-types';
import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants';
import { getToolInputQueryFilters, groupAndSum, validateYear } from '@/lib/utils';
import { Bill, Budget, Expense, Fuel, Sale } from '@/types/app-types';
import { IBillsRepository, IUserRepository } from '@/lib/db';
import { createCalendarEvent, refreshAccessToken } from '../google-calendar.service';
import { auth } from '../auth.service';

export interface IChatService {
  executeToolCall(toolCallProps: ToolCallProps): Promise<unknown>
}

export class ChatService implements IChatService {
  constructor(
    private expensesRepository: IFullMCPQueryRepository<Expense>,
    private revenuesRepository: IFullMCPQueryRepository<Budget>,
    private billsRepository: IBillsRepository,
    private fuelRepository: IFullMCPQueryRepository<Fuel>,
    private salesRepository: IMCPQueryRepository<Sale>,
    private userRepository: IUserRepository) { }

  async executeToolCall(props: ToolCallProps): Promise<unknown> {
    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.EXPENSES).includes(props.toolName)) {
      return this.handleExpenseTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.REVENUES).includes(props.toolName)) {
      return this.handleRevenueTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.BILLS).includes(props.toolName)) {
      return this.handleBillTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.FUEL).includes(props.toolName)) {
      return this.handleFuelTool(props);
    }

    if (Object.values(TOOL_HANDLER_NAME_OPTIONS.SALES).includes(props.toolName)) {
      return this.handleSaleTool(props);
    }
    
    throw new Error(`Unknown tool: ${props.toolName}`);
  }

  private async handleExpenseTool({ toolName, toolInput, userId, currency }: ToolCallProps) {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.QUERY_EXPENSES:
        return this.getBudgetsWithFilter(userId, currency, toolInput, this.expensesRepository);

      case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.SUMMARIZE_EXPENSES: {
        const { groupBy, year, month } = toolInput;
        validateYear(year);
        if (!groupBy) throw new Error('groupBy is required');
        const expenses = await this.expensesRepository.queryWithFilters(userId, currency, { year, month });
        return groupAndSum(expenses as unknown as Record<string, unknown>[], groupBy);
      }

      case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.GET_EXPENSE_CATEGORIES:
        return EXPENSE_CATEGORIES.map(({ value, label }) => ({ value, label }));

      case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.ADD_EXPENSE: {
        const expense = await this.createBudget(userId, currency, toolInput, this.expensesRepository);
        return { success: true, expense };
      }

      default:
        throw new Error(`Unknown expense tool: ${toolName}`);
    }
  }

  private async handleRevenueTool({ toolName, toolInput, userId, currency }: ToolCallProps) {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.REVENUES.QUERY_REVENUES:
        return this.getBudgetsWithFilter(userId, currency, toolInput, this.revenuesRepository);

      case TOOL_HANDLER_NAME_OPTIONS.REVENUES.ADD_REVENUE: {
        const revenue = await this.createBudget(userId, currency, toolInput, this.revenuesRepository);
        return { success: true, revenue };
      }

      default:
        throw new Error(`Unknown revenue tool: ${toolName}`);
    }
  }

  private async handleBillTool({ toolName, toolInput, userId, currency }: ToolCallProps) {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.BILLS.QUERY_BILLS: {
        const filters = getToolInputQueryFilters(toolInput);
        const items = await this.billsRepository.queryWithFilters(userId, currency, filters);
        return items.map(({ id, description, type, typeDescription, responsible, value, expirationDate, paid, barCode }) => ({
          id, description, type, typeDescription, responsible, value, expirationDate, paid, barCode
        }));
      }

      case TOOL_HANDLER_NAME_OPTIONS.BILLS.ADD_BILL: {
        const { saveAsExpense, ...billData } = toolInput;
        const bill = await this.billsRepository.create({
          ...billData, userId, currencyCurrencyAccount: currency,
        } as Bill) as Bill;
        await this.userRepository.addUserPoints(userId, POINTS.BILL_SAVED);
        if (saveAsExpense) {
          const expenseType = BILLS_EXPENSE_CATEGORIES.has(bill.type) ? bill.type : 'OUTROS';
          await this.expensesRepository.create({
            description: bill.description,
            type: expenseType,
            value: bill.value,
            firstExpirationDate: bill.expirationDate as string,
            monthsLeft: 1,
            userId,
            currencyCurrencyAccount: currency,
          } as Expense);
        }
        await this.userRepository.getGoogleRefreshToken(userId).then(async (refreshToken: string | null) => {
          if (!refreshToken) return;
          const accessToken = await refreshAccessToken(refreshToken);
          if (!accessToken) return;
          await createCalendarEvent(accessToken, {
            ...bill,
            expirationDate: String(bill.expirationDate),
            currency: bill.currencyCurrencyAccount,
          });
        }).catch(() => { });
        return { success: true, bill };
      }

      default:
        throw new Error(`Unknown bill tool: ${toolName}`);
    }
  }

  private async handleFuelTool({ toolName, toolInput, userId, currency }: ToolCallProps) {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.FUEL.QUERY_FUEL: {
        const { year, month } = toolInput;
        validateYear(year);
        if (month) {
          return await this.fuelRepository.getByMonthAndYear({ userId, currency, year, month });
        }
        return await this.fuelRepository.getByYear({ userId, currency, year });
      }

      case TOOL_HANDLER_NAME_OPTIONS.FUEL.ADD_FUEL_ENTRY: {
        const { creationDate, value, valuePerLiter } = toolInput;
        const fuel = await this.fuelRepository.create({
          creationDate, value, valuePerLiter,
          userId, currencyCurrencyAccount: currency,
        } as Fuel);
        return { success: true, fuel };
      }

      default:
        throw new Error(`Unknown fuel tool: ${toolName}`);
    }
  }

  private async handleSaleTool({ toolName, toolInput, currency }: ToolCallProps) {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.SALES.QUERY_SALES: {
        const session = await auth()

        if (!session?.user?.access?.includes('sales')) {
          throw new Error('User does not have access to sales data');
        }
        return await this.salesRepository.getAllByCurrency?.(currency);
      }

      case TOOL_HANDLER_NAME_OPTIONS.SALES.ADD_SALE: {
        const {
          description, room, roomDescription, buyer, value, valuePaid, discount,
          installments = 1, bookingDate, saleDate, paid = false, delivered = false,
        } = toolInput;
        const sale = await this.salesRepository.create({
          description, room, roomDescription, buyer, value, valuePaid, discount,
          installments, bookingDate, saleDate, paid, delivered,
          currencyCurrencyAccount: currency,
        } as Sale);
        return { success: true, sale };
      }

      default:
        throw new Error(`Unknown sale tool: ${toolName}`);
    }
  }

  private async getBudgetsWithFilter<T extends Budget>(userId: string, currency: string, toolInput: ToolInput, repository: IMCPQueryRepository<T>) {
    const filters = getToolInputQueryFilters(toolInput);
    const items = await repository.queryWithFilters(userId, currency, filters);
    return items.map(({ id, description, type, typeDescription, responsible, value, firstExpirationDate }) => ({
      id, description, type, typeDescription, responsible, value, firstExpirationDate,
    }));
  }

  private async createBudget<T extends Budget>(
    userId: string,
    currency: string,
    toolInput: ToolInput,
    repository: IFullMCPQueryRepository<T>,
  ): Promise<T> {
    const { description, type, value, firstExpirationDate, responsible, monthsLeft = 1 } = toolInput;
    return await repository.create({
      description, type, value, firstExpirationDate, responsible, monthsLeft,
      userId, currencyCurrencyAccount: currency,
    } as T) as T;
  }
}
