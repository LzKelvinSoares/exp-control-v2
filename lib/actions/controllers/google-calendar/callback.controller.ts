import { useRepository } from '@/hooks/api';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../services';

export function createGoogleCalendarCallbackRoutes() {
    return {
        GET: async (req: NextRequest) => {
            const { userRepository } = useRepository();

            const session = await auth();
            if (!session?.user?.id) {
                return NextResponse.redirect(new URL('/login', req.url));
            }

            const code = req.nextUrl.searchParams.get('code')
            if (!code) {
                return NextResponse.redirect(new URL('/bills', req.url));
            }

            const res = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    redirect_uri: `${process.env.NEXTAUTH_URL}/api/google-calendar/callback`,
                    code,
                    grant_type: 'authorization_code',
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.refresh_token) {
                    await userRepository.saveGoogleRefreshToken(session.user.id, data.refresh_token);
                }
            }

            return NextResponse.redirect(new URL('/bills?calendar=connected', req.url));
        }
    }
}