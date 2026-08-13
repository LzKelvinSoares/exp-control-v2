import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getGoogleRefreshToken } from '@/lib/db/users'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = await getGoogleRefreshToken(session.user.id)
  return NextResponse.json({ connected: !!token })
}
