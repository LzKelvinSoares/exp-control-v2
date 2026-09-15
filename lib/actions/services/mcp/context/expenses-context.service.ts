import { EXPENSE_CATEGORIES, TOOL_HANDLER_NAME_OPTIONS } from '@/constants'
import { createBudget, getBudgetsWithFilter, groupAndSum, updateOwnedBudget, validateYear } from '@/lib/utils'
import { Expense } from '@/types/app-types'
import { IChatContextService, IFullMCPQueryRepository, ToolCallProps, ToolInput } from '@/types/server-types'

export class ExpensesContextService implements IChatContextService<Expense> {
    constructor(
        private expensesRepository: IFullMCPQueryRepository<Expense>
    ) {
    }

    async handleTool<T>({ toolName, toolInput, userId, currency }: ToolCallProps): Promise<T[]> {
        switch (toolName) {
            case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.QUERY_EXPENSES:
                return await this.handleQueryExpenses<T>(userId, currency, toolInput);

            case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.SUMMARIZE_EXPENSES: {
                return await this.handleSummarizeExpenses<T>(toolInput, userId, currency);
            }

            case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.GET_EXPENSE_CATEGORIES:
                return this.handleGetExpenseCategories<T>();

            case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.ADD_EXPENSE: {
                return await this.handleAddExpense<T>(userId, currency, toolInput);
            }

            case TOOL_HANDLER_NAME_OPTIONS.EXPENSES.UPDATE_EXPENSE: {
                return await this.handleUpdateExpense<T>(toolInput, userId, currency);
            }

            default:
                throw new Error(`Unknown expense tool: ${toolName}`);
        }
    }

    private async handleUpdateExpense<T>(toolInput: ToolInput, userId: string, currency: string) {
        const { id, description, type, value, firstExpirationDate, responsible } = toolInput;
        const expense = await updateOwnedBudget(this.expensesRepository, id, userId, currency, {
            description, type, value, firstExpirationDate, responsible,
        });
        return { success: true, expense } as unknown as T[];
    }

    private async handleAddExpense<T>(userId: string, currency: string, toolInput: ToolInput) {
        const expense = await createBudget(userId, currency, toolInput, this.expensesRepository);
        return { success: true, expense } as unknown as T[];
    }

    private handleGetExpenseCategories<T>(): T[] | PromiseLike<T[]> {
        return EXPENSE_CATEGORIES.map(({ value, label }) => ({ value, label })) as unknown as T[];
    }

    private async handleQueryExpenses<T>(userId: string, currency: string, toolInput: ToolInput): Promise<T[]> {
        return await getBudgetsWithFilter(userId, currency, toolInput, this.expensesRepository) as unknown as T[];
    }

    private async handleSummarizeExpenses<T>(toolInput: ToolInput, userId: string, currency: string) {
        const { groupBy, year, month } = toolInput;
        validateYear(year);
        if (!groupBy) throw new Error('groupBy is required');
        const expenses = await this.expensesRepository.queryWithFilters(userId, currency, { year, month });
        return groupAndSum(expenses as unknown as Record<string, unknown>[], groupBy) as unknown as T[];
    }
}