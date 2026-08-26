import { IChatRequest } from '@/types/server-types';
import { withServices } from '../middlewares';

            

export function createChatRoutes() {
    return {
        POST: withServices(async (req, ctx, { aiContextService }) => {
            const body = await req.json() as IChatRequest;
            return await aiContextService.getMessageContent(body, ctx);
        })
    };
}