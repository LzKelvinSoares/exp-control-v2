import { TOOL_HANDLER_NAME_OPTIONS } from '@/constants'
import {  updateOwnedBudget, validateYear } from '@/lib/utils'
import { Fuel } from '@/types/app-types';
import { IChatContextService, IFullMCPQueryRepository, ToolCallProps, ToolInput } from '@/types/server-types'

export class FuelContextService implements IChatContextService<Fuel> {
    constructor(
        private fuelRepository: IFullMCPQueryRepository<Fuel>
    ) {
    }

    async handleTool<T>({ toolName, toolInput, userId, currency }: ToolCallProps): Promise<T[]> {
        switch (toolName) {
            case TOOL_HANDLER_NAME_OPTIONS.FUEL.QUERY_FUEL: {
                return await this.handleGetFuel(userId, currency, toolInput);
            }

            case TOOL_HANDLER_NAME_OPTIONS.FUEL.ADD_FUEL_ENTRY: {
                return await this.handleAddFuelEntry<T>(toolInput, userId, currency);
            }

            case TOOL_HANDLER_NAME_OPTIONS.FUEL.UPDATE_FUEL_ENTRY: {
                return await this.handleUpdateFuelEntry<T>(toolInput, userId, currency);
            }

            default:
                throw new Error(`Unknown fuel tool: ${toolName}`);
        }
    }

    private async handleGetFuel<T>(userId: string, currency: string, toolInput: ToolInput): Promise<T[]> {
        const { year, month } = toolInput;
        validateYear(year);
        if (month) {
            return await this.fuelRepository.getByMonthAndYear({ userId, currency, year, month }) as unknown as T[];
        }
        return await this.fuelRepository.getByYear({ userId, currency, year }) as unknown as T[];
    }

    private async handleAddFuelEntry<T>(toolInput: ToolInput, userId: string, currency: string) {
        const { creationDate, value, valuePerLiter } = toolInput;
        const fuel = await this.fuelRepository.create({
            creationDate, value, valuePerLiter,
            userId, currencyCurrencyAccount: currency,
        } as Fuel);
        return { success: true, fuel } as unknown as T[];
    }

    private async handleUpdateFuelEntry<T>(toolInput: ToolInput, userId: string, currency: string) {
        const { id, creationDate, value, valuePerLiter } = toolInput;
        const fuel = await updateOwnedBudget(this.fuelRepository, id, userId, currency, {
            creationDate, value, valuePerLiter,
        } as Partial<Fuel>);
        return { success: true, fuel } as unknown as T[];
    }
}