import { useRepository } from '@/hooks/api';
import { Bill } from '@/types/app-types';
import { getMonthYearParams } from './params.service';
import { NextRequest } from 'next/server';
import { AuthContext } from './api.service';
import { createCalendarEvent, refreshAccessToken } from './google-calendar.service';
import { BILLS_EXPENSE_CATEGORIES, POINTS } from '@/constants';
import { findById } from '@/lib/db/crud';
import BillModel from '@/models/Bill';
import { IUserRepository } from '@/lib/db';

interface IBillsService {
    getBills(req: NextRequest, ctx: AuthContext): Promise<Bill[]>;
    createBill(req: NextRequest, ctx: AuthContext): Promise<Bill>;
    updateBill(req: NextRequest, ctx: AuthContext): Promise<Bill>;
    pay(req: NextRequest, ctx: AuthContext): Promise<void>;
    deleteBill(id: string): Promise<void>;
}

export class BillsService implements IBillsService {
    async getBills(req: NextRequest, ctx: AuthContext): Promise<Bill[]> {
        const { billsRepository } = useRepository();
        const dueSoon = req.nextUrl.searchParams.get('dueSoon');
        if (dueSoon) {
            return await billsRepository.getBillsDueSoon(ctx.userId, ctx.currency, Number(dueSoon));
        }

        const { month, year } = getMonthYearParams(req);
        return await billsRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    
    async createBill(req: NextRequest, ctx: AuthContext): Promise<Bill> {
        const { billsRepository, expensesRepository, userRepository } = useRepository();
        const { saveAsExpense, ...body } = await req.json();
        const bill = await billsRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency });
        await userRepository.addUserPoints(ctx.userId, POINTS.BILL_SAVED);
        if (saveAsExpense) {
            const expenseType = BILLS_EXPENSE_CATEGORIES.has(bill.type) ? bill.type : 'OUTROS';
            await expensesRepository.create({
                description: bill.description,
                type: expenseType,
                value: bill.value,
                firstExpirationDate: bill.expirationDate as string,
                monthsLeft: 1,
                userId: ctx.userId,
                currencyCurrencyAccount: ctx.currency,
            });
        }
        await this._createCalendarEventForBill(bill, ctx, userRepository);
        return bill;
    }

    async pay(req: NextRequest, ctx: AuthContext): Promise<void> {
        const { id, action, ids } = await req.json();
        if (!id && !ids) throw new Error('id is required');
        const { billsRepository, userRepository } = useRepository();

        if (action === 'payMany' && ids) {
            await billsRepository.payBills(ids);
            // award points per bill based on due date
            await Promise.all(
                (ids as string[]).map(async (billId) => {
                    await this._addUserPointsForBill(ctx, billId, userRepository);
                })
            );
        }

        if (action === 'pay' && id) {
            await billsRepository.payBill(id);
            await this._addUserPointsForBill(ctx, id, userRepository);
        }
    }
    async updateBill(req: NextRequest, ctx: AuthContext): Promise<Bill> {
        const { id, body } = await req.json();
        if (!id) throw new Error('id is required');
        const { billsRepository } = useRepository();
        return await billsRepository.update(id, body);
    }

    async deleteBill(id: string): Promise<void> {
        const { billsRepository } = useRepository();
        await billsRepository.delete(id);
    }

    private async _addUserPointsForBill(ctx: AuthContext, billId: string, userRepository: IUserRepository): Promise<void> {
        const bill = await findById<Bill>(BillModel, billId);
        if (!bill) return;
        const isLate = bill.expirationDate && new Date(bill.expirationDate) < new Date();
        await userRepository.addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME);
    }

    private async _createCalendarEventForBill(bill: Bill, ctx: AuthContext, userRepository: IUserRepository): Promise<void> {
        // Fire-and-forget: never block or fail bill creation
        userRepository.getGoogleRefreshToken(ctx.userId).then(async (refreshToken: string | null) => {
            if (!refreshToken) return;
            const accessToken = await refreshAccessToken(refreshToken);
            if (!accessToken) return;
            await createCalendarEvent(accessToken, {
                ...bill as Bill,
                expirationDate: String((bill as Bill).expirationDate),
            });
        }).catch(() => { });
    }

}