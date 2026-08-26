import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { IMCPQueryRepository, ToolCallProps, ToolInput } from '@/types/server-types';
import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants';
import { getBudgetQueryFilters, groupAndSum, validateYear } from '@/lib/utils';
import { Budget, Expense } from '@/types/app-types';
import { IBillsRepository } from '@/lib/db';

export interface IChatService {
  executeToolCall(toolCallProps: ToolCallProps): Promise<unknown>
}

export class ChatService implements IChatService {
  constructor(
    private expensesRepository: IMCPQueryRepository<Expense>,
    private revenuesRepository: IMCPQueryRepository<Budget>,
    private billsRepository: IBillsRepository) { }

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
