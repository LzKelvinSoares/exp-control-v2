const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return (data.access_token as string) ?? null
}

export async function createCalendarEvent(
  accessToken: string,
  bill: { description: string; value: number; expirationDate: string; type?: string },
): Promise<void> {
  const date = (bill.expirationDate as string).slice(0, 10) // YYYY-MM-DD

  await fetch(`${CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: `${bill.description} — R$ ${bill.value.toFixed(2)}`,
      description: `Conta a pagar\nValor: R$ ${bill.value.toFixed(2)}\nCategoria: ${bill.type ?? ''}`,
      start: { date },
      end: { date },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 1440 }, // 1 day before
          { method: 'popup', minutes: 0 },    // on the day
        ],
      },
    }),
  })
}
