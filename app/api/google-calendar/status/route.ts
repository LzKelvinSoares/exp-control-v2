import { auth } from '@/lib/auth'
import { useService } from '@/lib/providers/service-provider';
import { NextResponse } from 'next/server'

export async function GET() {
  const { userService } = useService();
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = await userService.getGoogleRefreshToken(session.user.id);
  return NextResponse.json({ connected: !!token });
}
