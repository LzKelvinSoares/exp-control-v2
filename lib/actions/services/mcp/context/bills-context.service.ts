import { BILLS_EXPENSE_CATEGORIES, POINTS, TOOL_HANDLER_NAME_OPTIONS } from '@/constants'
import { getToolInputQueryFilters, updateOwnedBudget } from '@/lib/utils'
import { Bill, Expense } from '@/types/app-types'
import { IChatContextService, IFullMCPQueryRepository, ToolCallProps, ToolInput } from '@/types/server-types'
import { createCalendarEvent, refreshAccessToken } from '../../google-calendar.service';
import { IBillsRepository, IUserRepository } from '@/lib/db';

export class BillsContextService implements IChatContextService<Bill> {
    constructor(
        private billsRepository: IBillsRepository,
        private expensesRepository: IFullMCPQueryRepository<Expense>,
        private userRepository: IUserRepository
    ) {
    }

    async handleTool<T>({ toolName, toolInput, userId, currency }: ToolCallProps): Promise<T[]> {
        switch (toolName) {
            case TOOL_HANDLER_NAME_OPTIONS.BILLS.QUERY_BILLS: {
                return await this.handleQueryBills<T>(toolInput, userId, currency);
            }

            case TOOL_HANDLER_NAME_OPTIONS.BILLS.ADD_BILL: {
                return await this.handleAddBill<T>(toolInput, userId, currency);
            }

            case TOOL_HANDLER_NAME_OPTIONS.BILLS.UPDATE_BILL: {
                return await this.handleUpdateBill<T>(toolInput, userId, currency);
            }

            default:
                throw new Error(`Unknown bill tool: ${toolName}`);
        }
    }

    private async handleUpdateBill<T>(toolInput: ToolInput, userId: string, currency: string) {
        const { id, description, type, value, expirationDate, barCode, paid, responsible } = toolInput;
        const bill = await updateOwnedBudget(this.billsRepository, id, userId, currency, {
            description, type, value, expirationDate, barCode, paid, responsible,
        } as Partial<Bill>);
        return { success: true, bill } as unknown as T[];
    }

    private async handleAddBill<T>(toolInput: ToolInput, userId: string, currency: string) {
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
        return { success: true, bill } as unknown as T[];
    }

    private async handleQueryBills<T>(toolInput: ToolInput, userId: string, currency: string) {
        const filters = getToolInputQueryFilters(toolInput);
        const items = await this.billsRepository.queryWithFilters(userId, currency, filters);
        return items.map(({ id, description, type, typeDescription, responsible, value, expirationDate, paid, barCode }) => ({
            id, description, type, typeDescription, responsible, value, expirationDate, paid, barCode
        })) as unknown as T[];
    }
}