import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants'
import { createBudget, getBudgetsWithFilter, updateOwnedBudget } from '@/lib/utils'
import { Budget } from '@/types/app-types'
import { IChatContextService, IFullMCPQueryRepository, ToolCallProps, ToolInput } from '@/types/server-types'

export class RevenuesContextService implements IChatContextService<Budget> {
    constructor(
        private revenuesRepository: IFullMCPQueryRepository<Budget>
    ) {
    }

    async handleTool<T>({ toolName, toolInput, userId, currency }: ToolCallProps): Promise<T[]> {
        switch (toolName) {
            case TOOL_HANDLER_NAME_OPTIONS.REVENUES.QUERY_REVENUES:
                return await this.handleQueryRevenues<T>(userId, currency, toolInput);

            case TOOL_HANDLER_NAME_OPTIONS.REVENUES.ADD_REVENUE: {
                return await this.handleAddRevenue<T>(userId, currency, toolInput);
            }

            case TOOL_HANDLER_NAME_OPTIONS.REVENUES.UPDATE_REVENUE: {
                return await this.handleUpdateRevenue<T>(toolInput, userId, currency);
            }

            default:
                throw new Error(`Unknown revenue tool: ${toolName}`);
        }
    }

    private async handleQueryRevenues<T>(userId: string, currency: string, toolInput: ToolInput): Promise<T[]> {
        return await getBudgetsWithFilter(userId, currency, toolInput, this.revenuesRepository) as unknown as T[];
    }

    private async handleUpdateRevenue<T>(toolInput: ToolInput, userId: string, currency: string) {
        const { id, description, type, value, firstExpirationDate, responsible } = toolInput;
        const revenue = await updateOwnedBudget(this.revenuesRepository, id, userId, currency, {
            description, type, value, firstExpirationDate, responsible,
        });
        return { success: true, revenue } as unknown as T[];
    }

    private async handleAddRevenue<T>(userId: string, currency: string, toolInput: ToolInput) {
        const revenue = await createBudget(userId, currency, toolInput, this.revenuesRepository);
        return { success: true, revenue } as unknown as T[];
    }
}