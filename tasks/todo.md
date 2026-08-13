# Google Calendar Integration for Bill Due Dates

## Plan

### How it works
**For Google sign-in users:** calendar scope is requested during sign-in; refresh token saved automatically.
**For credentials users (or Google users who signed in before this feature):** a "Connect Google Calendar" button triggers a dedicated OAuth flow that only requests the calendar scope.

Once a refresh token is stored, bill creation silently creates a Google Calendar event on the due date.

### OAuth flow for manual connect
1. User clicks "Connect Google Calendar" → hits `/api/google-calendar/connect`
2. Server redirects to Google OAuth (`calendar.events` scope, `access_type=offline`, `prompt=consent`)
3. Google redirects to `/api/google-calendar/callback?code=...`
4. Server exchanges code for tokens, saves refresh token to User document
5. Redirects to `/bills?calendar=connected`

### No new packages needed
All API calls via plain `fetch`. Auth routes use `withAuth`.

---

## Todo

### Data layer
- [x] Add `googleRefreshToken?: string` to `models/User.ts`
- [x] Add `saveGoogleRefreshToken` and `getGoogleRefreshToken` to `lib/db/users.ts`

### Auth
- [x] Update `lib/auth.ts`:
  - Add `calendar.events` scope + `access_type: offline` to Google provider
  - In `signIn` callback: when `account.refresh_token` is present, save to User document

### Google Calendar utility
- [x] Create `lib/google-calendar.ts`:
  - `refreshAccessToken(refreshToken)` — `POST https://oauth2.googleapis.com/token`
  - `createCalendarEvent(accessToken, bill)` — creates all-day event on `expirationDate` with 1-day popup reminder

### Manual connect flow (for credentials users + Google users not yet connected)
- [x] Create `app/api/google-calendar/connect/route.ts` — builds Google OAuth URL and redirects
- [x] Create `app/api/google-calendar/callback/route.ts` — exchanges code for tokens, saves refresh token, redirects to `/bills?calendar=connected`
- [x] Create `app/api/google-calendar/status/route.ts` — returns `{ connected: boolean }`

### Bills API
- [x] Update `app/api/bills/route.ts` POST handler:
  - After `createBill` succeeds, look up user's `googleRefreshToken`
  - If present, refresh access token and create calendar event (fire-and-forget)

### UI
- [x] Create `components/bills/GoogleCalendarBanner.tsx`
- [x] Add banner to `app/(dashboard)/bills/page.tsx`

---

## Review

### Changes made
- `models/User.ts` — added `googleRefreshToken` field
- `lib/db/users.ts` — added `saveGoogleRefreshToken` / `getGoogleRefreshToken`
- `lib/auth.ts` — calendar scope on Google provider, save refresh token in `signIn`
- `lib/google-calendar.ts` — new utility: token refresh + calendar event creation via fetch
- `app/api/google-calendar/connect/route.ts` — initiates OAuth flow
- `app/api/google-calendar/callback/route.ts` — exchanges code, saves token, redirects
- `app/api/google-calendar/status/route.ts` — reports connection status
- `app/api/bills/route.ts` — fire-and-forget calendar event on bill creation
- `components/bills/GoogleCalendarBanner.tsx` — connect banner with Suspense wrapper
- `app/(dashboard)/bills/page.tsx` — renders the banner
