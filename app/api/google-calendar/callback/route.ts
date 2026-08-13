import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { saveGoogleRefreshToken } from '@/lib/db/users'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect(new URL('/bills', req.url))
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
  })

  if (res.ok) {
    const data = await res.json()
    if (data.refresh_token) {
      await saveGoogleRefreshToken(session.user.id, data.refresh_token)
    }
  }

  return NextResponse.redirect(new URL('/bills?calendar=connected', req.url))
}
