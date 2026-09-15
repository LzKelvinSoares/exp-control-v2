import { Budget } from '@/types/app-types'
import { IFullMCPQueryRepository, IMCPQueryRepository, ToolInput } from '@/types/server-types'
import { getToolInputQueryFilters } from './queries'

export async function createBudget<T extends Budget>(
    userId: string,
    currency: string,
    toolInput: ToolInput,
    repository: IFullMCPQueryRepository<T>,
): Promise<T> {
    const { description, type, value, firstExpirationDate, responsible, monthsLeft = 1 } = toolInput;
    return await repository.create({
        description, type, value, firstExpirationDate, responsible, monthsLeft,
        userId, currencyCurrencyAccount: currency,
    } as T) as T
}

export async function getBudgetsWithFilter<T extends Budget>(userId: string, currency: string, toolInput: ToolInput, repository: IMCPQueryRepository<T>) {
    const filters = getToolInputQueryFilters(toolInput)
    const items = await repository.queryWithFilters(userId, currency, filters);
    return items.map(({ id, description, type, typeDescription, responsible, value, firstExpirationDate }) => ({
        id, description, type, typeDescription, responsible, value, firstExpirationDate,
    }))
}

export async function updateOwnedBudget<T extends { userId: string; currencyCurrencyAccount: string }>(
    repository: IFullMCPQueryRepository<T>,
    id: string | undefined,
    userId: string,
    currency: string,
    data: Partial<T>,
): Promise<T> {
    if (!id) throw new Error('id is required');
    if (!repository.getById) throw new Error('Repository does not support updates');

    const current = await repository.getById(id);
    if (!current || current.userId !== userId || current.currencyCurrencyAccount !== currency) {
        throw new Error('Record not found');
    }

    const updated = await repository.update(id, removeUndefined(data));
    if (!updated) throw new Error('Record not found');
    return updated;
}

export function removeUndefined<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    ) as Partial<T>;
}