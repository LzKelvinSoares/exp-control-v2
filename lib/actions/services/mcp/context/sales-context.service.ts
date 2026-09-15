import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants'
import { removeUndefined } from '@/lib/utils'
import { Sale } from '@/types/app-types';
import { IChatContextService, IMCPQueryRepository, ToolCallProps, ToolInput } from '@/types/server-types'
import { auth } from '../../auth.service';

export class SalesContextService implements IChatContextService<Sale> {
    constructor(
        private salesRepository: IMCPQueryRepository<Sale>
    ) {
    }

    async handleTool<T>({ toolName, toolInput, currency }: ToolCallProps): Promise<T[]> {
        const session = await auth()
        
        if (!session?.user?.access?.includes('sales')) {
            throw new Error('User does not have access to sales data');
        }
    
        switch (toolName) {
            case TOOL_HANDLER_NAME_OPTIONS.SALES.QUERY_SALES: {
                return await this.salesRepository.getAllByCurrency?.(currency) as unknown as T[];
            }
    
            case TOOL_HANDLER_NAME_OPTIONS.SALES.ADD_SALE: {
                return await this.handleAddSale<T>(toolInput, currency);
            }
    
            case TOOL_HANDLER_NAME_OPTIONS.SALES.UPDATE_SALE: {
                return await this.handleUpdateSale<T>(toolInput, currency);
            }
    
            default:
            throw new Error(`Unknown sale tool: ${toolName}`);
        }
    }

    private async handleAddSale<T>(toolInput: ToolInput, currency: string) {
        const {
            description, room, roomDescription, buyer, value, valuePaid, discount, installments = 1, bookingDate, saleDate, paid = false, delivered = false,
        } = toolInput;
        const sale = await this.salesRepository.create({
            description, room, roomDescription, buyer, value, valuePaid, discount,
            installments, bookingDate, saleDate, paid, delivered,
            currencyCurrencyAccount: currency,
        } as Sale);
        return { success: true, sale } as unknown as T[];
    }

    private async handleUpdateSale<T>(toolInput: ToolInput, currency: string) {
        const {
            id, description, room, roomDescription, buyer, value, valuePaid, discount, installments, bookingDate, saleDate, paid, delivered,
        } = toolInput;
        const sale = await this.updateSale(currency, id, {
            description, room, roomDescription, buyer, value, valuePaid, discount,
            installments, bookingDate, saleDate, paid, delivered,
        });
        return { success: true, sale } as unknown as T[];
    }

    private async updateSale(
        currency: string,
        id: string | undefined,
        data: Partial<Sale>,
    ): Promise<Sale> {
        if (!id) throw new Error('id is required');
        if (!this.salesRepository.getById) throw new Error('Repository does not support updates');

        const current = await this.salesRepository.getById(id);
        if (!current || current.currencyCurrencyAccount !== currency) throw new Error('Record not found');

        const updated = await this.salesRepository.update(id, removeUndefined(data));
        if (!updated) throw new Error('Record not found');
        return updated;
    }
}