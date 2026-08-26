import { Bill, Expense } from '@/types/app-types';
import { getMonthYearParams } from './params.service';
import { NextRequest } from 'next/server';
import { createCalendarEvent, refreshAccessToken } from './google-calendar.service';
import { BILLS_EXPENSE_CATEGORIES, POINTS } from '@/constants';
import { findById } from '@/lib/db/crud';
import BillModel from '@/models/Bill';
import { IBillsRepository, IUserRepository } from '@/lib/db';
import { AuthContext, IFullTableCrudRepository, ITableCrudService } from '@/types/server-types';

export interface IBillsService extends ITableCrudService<Bill, Bill> {
    pay(action: string, id: string, ids: string[], ctx: AuthContext): Promise<void>;
}

export class BillsService implements IBillsService {
    constructor(
        private billsRepository: IBillsRepository, 
        private expensesRepository: IFullTableCrudRepository<Expense>,
        private userRepository: IUserRepository,
    ) {} 

    async get(req: NextRequest, ctx: AuthContext): Promise<Bill[]> {
        const dueSoon = req.nextUrl.searchParams.get('dueSoon');
        if (dueSoon) {
            return await this.billsRepository.getBillsDueSoon(ctx.userId, ctx.currency, Number(dueSoon));
        }

        const { month, year } = getMonthYearParams(req);
        return await this.billsRepository.getByMonthAndYear({ userId: ctx.userId, currency: ctx.currency, month, year });
    }
    
    async create(req: NextRequest, ctx: AuthContext): Promise<Bill> {
        const { saveAsExpense, ...body } = await req.json();
        const bill = await this.billsRepository.create({ ...body, userId: ctx.userId, currencyCurrencyAccount: ctx.currency }) as Bill;
        await this.userRepository.addUserPoints(ctx.userId, POINTS.BILL_SAVED);
        if (saveAsExpense) {
            const expenseType = BILLS_EXPENSE_CATEGORIES.has(bill.type) ? bill.type : 'OUTROS';
            await this.expensesRepository.create({
                description: bill.description,
                type: expenseType,
                value: bill.value,
                firstExpirationDate: bill.expirationDate as string,
                monthsLeft: 1,
                userId: ctx.userId,
                currencyCurrencyAccount: ctx.currency,
            });
        }
        await this._createCalendarEventForBill(bill, ctx);
        return bill;
    }

    async pay(action: string, id: string, ids: string[], ctx: AuthContext): Promise<void> {
        if (!id && !ids) throw new Error('id is required');

        if (action === 'payMany' && ids) {
            await this.billsRepository.payBills(ids);
            // award points per bill based on due date
            await Promise.all(
                (ids as string[]).map(async (billId) => {
                    await this._addUserPointsForBill(ctx, billId);
                })
            );
        }

        if (action === 'pay' && id) {
            await this.billsRepository.payBill(id);
            await this._addUserPointsForBill(ctx, id);
        }
    }

    async update(item: Bill): Promise<Bill> {
        if (!item.id) throw new Error('id is required');
        const data: Omit<Bill, 'id'> = item;
        return await this.billsRepository.update(item.id, data);
    }

    async delete(id: string): Promise<void> {
        await this.billsRepository.delete(id);
    }

    private async _addUserPointsForBill(ctx: AuthContext, billId: string): Promise<void> {
        const bill = await findById<Bill>(BillModel, billId);
        if (!bill) return;
        const isLate = bill.expirationDate && new Date(bill.expirationDate) < new Date();
        await this.userRepository.addUserPoints(ctx.userId, isLate ? POINTS.BILL_PAID_LATE : POINTS.BILL_PAID_ON_TIME);
    }

    private async _createCalendarEventForBill(bill: Bill, ctx: AuthContext): Promise<void> {
        // Fire-and-forget: never block or fail bill creation
        await this.userRepository.getGoogleRefreshToken(ctx.userId).then(async (refreshToken: string | null) => {
            if (!refreshToken) return;
            const accessToken = await refreshAccessToken(refreshToken);
            if (!accessToken) return;
            await createCalendarEvent(accessToken, {
                ...bill as Bill,
                expirationDate: String((bill as Bill).expirationDate),
                currency: bill.currencyCurrencyAccount
            });
        }).catch(() => { });
    }

}