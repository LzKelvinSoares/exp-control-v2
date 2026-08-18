import { NextResponse } from "next/server";
import { auth } from "../../services";
import { useRepository } from "@/hooks/api";

export function createGoogleCalendarStatusRoutes() {
    return {
        GET: async () =>  {
          const { userRepository } = useRepository();
          const session = await auth();
          if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }
        
          const token = await userRepository.getGoogleRefreshToken(session.user.id);
          return NextResponse.json({ connected: !!token });
        }
    }
}