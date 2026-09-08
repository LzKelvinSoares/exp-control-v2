import { IUserRepository } from '@/lib/db';
import { AuthContext, HasPoints, ITableReadAndUpdateService } from '@/types/server-types';
import { NextRequest } from 'next/server';

export class UserService implements ITableReadAndUpdateService<number, HasPoints> {
    constructor(private userRepository: IUserRepository) {
    }
    async update(item: HasPoints, ctx: AuthContext): Promise<number> {
        await this.userRepository.addUserPoints(ctx.userId, item.points);
        return this.getUserPoints(ctx.userId);
    }

    async get(_req: NextRequest, ctx: AuthContext): Promise<number> {
        const points = await this.getUserPoints(ctx.userId);
        return points;
    }

    private async getUserPoints(userId: string) {
        return await this.userRepository.getUserPoints(userId);
    }
}