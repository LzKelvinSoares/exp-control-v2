import { NextRequest } from 'next/server';
import { withAuth, ok, err, AuthContext } from '@/lib/actions/services/api.service';
import { findById } from '@/lib/db/crud';
import BillModel from '@/models/Bill';
import { BILLS_EXPENSE_CATEGORIES, POINTS } from '@/constants';
import { Bill } from '@/types/app-types';
import { useRepository, useServices } from '@/hooks/api';
import { createCalendarEvent, getMonthYearParams, refreshAccessToken } from '../services';

export function createBillsRoutes() {
    return {
        GET: withAuth(async (req, ctx) => {
            const { billsService } = useServices();
            return ok(await billsService.getBills(req, ctx));
        }),
        POST: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            const { billsService } = useServices();
            return ok(await billsService.createBill(req, ctx));
        }),
        PUT: withAuth(async (req: NextRequest, ctx: AuthContext) => {
            const { id, action } = await req.json();
            const { billsService } = useServices();

            if (['pay', 'payMany'].includes(action)) {
                await billsService.pay(req, ctx);
                return ok({ success: true });
            }

            if (!id) return err('id is required');
            return ok(await billsService.updateBill(req, ctx));
        }),
        DELETE: withAuth(async (req: NextRequest, _ctx: AuthContext) => {
            const { id } = await req.json();
            const { billsService } = useServices();
            if (!id) return err('id is required');
            await billsService.deleteBill(req, _ctx);
            return ok({ success: true });
        })
    }
}