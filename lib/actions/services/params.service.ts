import { NextRequest } from 'next/server';

export function getMonthYearParams(req: NextRequest) {
    const month = Number(req.nextUrl.searchParams.get('month'));
    const year = Number(req.nextUrl.searchParams.get('year'));
    if (!month || !year) throw new Error('month and year are required');
    return { month, year };
}
