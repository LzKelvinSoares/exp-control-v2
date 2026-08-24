import { MONTHS } from '@/constants';
import { Budget, Expense, Fuel, MonthlyChartData } from '@/types/app-types';
import { AuthContext, IFullTableCrudRepository, IMCPQueryRepository, IReadService } from '@/types/server-types';
import { NextRequest } from 'next/server';

export class ChartService implements IReadService<MonthlyChartData> {
    constructor(
        private expensesRepository: IMCPQueryRepository<Expense>, 
        private revenuesRepository: IMCPQueryRepository<Budget>, 
        private fuelRepository: IFullTableCrudRepository<Fuel>) {
    }

    async get(req: NextRequest, ctx: AuthContext): Promise<MonthlyChartData[]> {
        const year = Number(req.nextUrl.searchParams.get('year')) || new Date().getFullYear();

        const [expenses, revenues, fuel] = await Promise.all([
            this.expensesRepository.getByYear({ userId: ctx.userId, currency: ctx.currency, year }),
            this.revenuesRepository.getByYear({ userId: ctx.userId, currency: ctx.currency, year }),
            this.fuelRepository.getByYear({ userId: ctx.userId, currency: ctx.currency, year }),
        ]);

        return this._buildChartDataValues((expenses || []), (revenues || []), (fuel || []));
    }

    private _buildChartDataValues(expenses: Expense[], revenues: Budget[], fuel: Fuel[]): MonthlyChartData[] {
        return MONTHS.map(({ value, short }) => {
            const monthExpenses = expenses
                .filter((e) => new Date(e.firstExpirationDate as string).getMonth() + 1 === value)
                .reduce((sum, e) => sum + Number(e.value), 0);

            const monthFuel = fuel
                .filter((f) => new Date(f.creationDate).getMonth() + 1 === value)
                .reduce((sum, f) => sum + Number(f.value), 0);

            const monthRevenues = revenues
                .filter((r) => new Date(r.firstExpirationDate as string).getMonth() + 1 === value)
                .reduce((sum, r) => sum + Number(r.value), 0);

            return {
                month: short,
                expenses: monthExpenses + monthFuel,
                revenues: monthRevenues,
                fuel: monthFuel,
            };
        })
    }
}