import { BILLS_EXPENSE_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories';
import { POINTS } from '@/constants/levels';
import { IMCPQueryRepository, ToolCallProps, ToolInput, IFullMCPQueryRepository } from '@/types/server-types';
import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants';
import { getBudgetQueryFilters, groupAndSum, validateYear } from '@/lib/utils';
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

  async executeToolCall({
    toolName,
    toolInput,
    userId,
    currency
  }: ToolCallProps): Promise<unknown> {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.EXPENSES: {
        return await this.getBudgetsWithFilter(userId, currency, toolInput, this.expensesRepository);
      }

      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.REVENUES: {
        return await this.getBudgetsWithFilter(userId, currency, toolInput, this.revenuesRepository);
      }

      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.BILLS: {
        const filters = getBudgetQueryFilters(toolInput);
        const items = await this.billsRepository.queryWithFilters(userId, currency, filters);
        return items.map(({ id, description, type, typeDescription, responsible, value, expirationDate, paid, barCode }) => ({
          id, description, type, typeDescription, responsible, value, expirationDate, paid, barCode
        }));
      }
      case TOOL_HANDLER_NAME_OPTIONS.SUMMARIES.EXPENSES: {
        const { groupBy, year, month } = toolInput;
        validateYear(year);
        if (!groupBy) throw new Error('groupBy is required');
        const expenses = await this.expensesRepository.queryWithFilters(userId, currency, { year, month });
        return groupAndSum(expenses as unknown as Record<string, unknown>[], groupBy);
      }

      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.EXPENSE_CATEGORIES: {
        return EXPENSE_CATEGORIES.map(({ value, label }) => ({ value, label }));
      }

      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.FUEL: {
        const { year, month } = toolInput;
        validateYear(year);
        if (month) {
          return await this.fuelRepository.getByMonthAndYear({ userId, currency, year, month });
        }
        return await this.fuelRepository.getByYear({ userId, currency, year });
      }

      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.SALES: {
        const session = await auth()
        
        if (!session?.user?.access?.includes('sales')) {
          throw new Error('User does not have access to sales data');
        }
        return await this.salesRepository.getAllByCurrency?.(currency);
      }

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_EXPENSE: {
        const expense = await this.createBudget(userId, currency, toolInput, this.expensesRepository);
        return { success: true, expense };
      }

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_REVENUE: {
        const revenue = await this.createBudget(userId, currency, toolInput, this.revenuesRepository);
        return { success: true, revenue };
      }

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_FUEL_ENTRY: {
        const { creationDate, value, valuePerLiter } = toolInput;
        const fuel = await this.fuelRepository.create({
          creationDate, value, valuePerLiter,
          userId, currencyCurrencyAccount: currency,
        } as Fuel);
        return { success: true, fuel };
      }

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_BILL: {
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

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_SALE: {
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
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  private async getBudgetsWithFilter<T extends Budget>(userId: string, currency: string, toolInput: ToolInput, repository: IMCPQueryRepository<T>) {
    const filters = getBudgetQueryFilters(toolInput);
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
