import { BILLS_EXPENSE_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories';
import { POINTS } from '@/constants/levels';
import { IMCPQueryRepository, IFullTableCrudRepository, ToolCallProps, ToolInput } from '@/types/server-types';
import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants';
import { getBudgetQueryFilters, groupAndSum, validateYear } from '@/lib/utils';
import { Bill, Budget, Expense, Fuel } from '@/types/app-types';
import { IBillsRepository, IUserRepository } from '@/lib/db';
import { createCalendarEvent, refreshAccessToken } from '../google-calendar.service';

export interface IChatService {
  executeToolCall(toolCallProps: ToolCallProps): Promise<unknown>
}

export class ChatService implements IChatService {
  constructor(
    private expensesRepository: IMCPQueryRepository<Expense>,
    private revenuesRepository: IMCPQueryRepository<Budget>,
    private billsRepository: IBillsRepository,
    private fuelRepository: IFullTableCrudRepository<Fuel>,
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

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_EXPENSE: {
        const { description, type, value, firstExpirationDate, responsible, monthsLeft = 1 } = toolInput;
        const expense = await this.expensesRepository.create({
          description, type, value, firstExpirationDate, responsible, monthsLeft,
          userId, currencyCurrencyAccount: currency,
        } as Expense);
        return { success: true, expense };
      }

      case TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_REVENUE: {
        const { description, type, value, firstExpirationDate, responsible, monthsLeft = 1 } = toolInput;
        const revenue = await this.revenuesRepository.create({
          description, type, value, firstExpirationDate, responsible, monthsLeft,
          userId, currencyCurrencyAccount: currency,
        } as Budget);
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
}
