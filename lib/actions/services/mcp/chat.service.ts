import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { IMCPQueryRepository, ToolCallProps } from '@/types/server-types';
import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants';
import { getBudgetQueryFilters, groupAndSum, validateYear } from '@/lib/utils';
import { Budget, Expense } from '@/types/app-types';

export interface IChatService {
  executeToolCall(toolCallProps: ToolCallProps): Promise<unknown>
}

export class ChatService implements IChatService {
  constructor(
    private expensesRepository: IMCPQueryRepository<Expense>,
    private revenuesRepository: IMCPQueryRepository<Budget>) { }

  async executeToolCall({
    toolName,
    toolInput,
    userId,
    currency
  }: ToolCallProps): Promise<unknown> {
    switch (toolName) {
      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.EXPENSES: {
        const filters = getBudgetQueryFilters(toolInput);
        const expenses = await this.expensesRepository.queryWithFilters(userId, currency, filters);
        return expenses.map(({ id, description, type, typeDescription, responsible, value, firstExpirationDate }) => ({
          id, description, type, typeDescription, responsible, value, firstExpirationDate,
        }));
      }

      case TOOL_HANDLER_NAME_OPTIONS.QUERIES.REVENUES: {
        const filters = getBudgetQueryFilters(toolInput);
        const revenues = await this.revenuesRepository.queryWithFilters(userId, currency, filters);
        return revenues.map(({ id, description, type, typeDescription, responsible, value, firstExpirationDate }) => ({
          id, description, type, typeDescription, responsible, value, firstExpirationDate,
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
}
