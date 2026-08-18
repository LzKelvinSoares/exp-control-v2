import { MONTHS } from '@/constants';
import { useRepository } from '@/hooks/api';
import { ok, withAuth } from '../services';
import { MonthlyChartData } from '@/types/app-types';

export function createChartRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { expensesRepository, fuelRepository, revenuesRepository } = useRepository();
            const year = Number(req.nextUrl.searchParams.get('year')) || new Date().getFullYear();

            const [expenses, revenues, fuel] = await Promise.all([
                expensesRepository.getByYear({ userId: ctx.userId, currency: ctx.currency, year }),
                revenuesRepository.getByYear({ userId: ctx.userId, currency: ctx.currency, year }),
                fuelRepository.getByYear({ userId: ctx.userId, currency: ctx.currency, year }),
            ]);

            const data: MonthlyChartData[] = MONTHS.map(({ value, short }) => {
                const monthExpenses = (expenses || [])
                    .filter((e) => new Date(e.firstExpirationDate as string).getMonth() + 1 === value)
                    .reduce((sum, e) => sum + Number(e.value), 0);

                const monthFuel = (fuel || [])
                    .filter((f) => new Date(f.creationDate).getMonth() + 1 === value)
                    .reduce((sum, f) => sum + Number(f.value), 0);

                const monthRevenues = (revenues || [])
                    .filter((r) => new Date(r.firstExpirationDate as string).getMonth() + 1 === value)
                    .reduce((sum, r) => sum + Number(r.value), 0);

                return {
                    month: short,
                    expenses: monthExpenses + monthFuel,
                    revenues: monthRevenues,
                    fuel: monthFuel,
                };
            })

            return ok(data);
        })
    }
}