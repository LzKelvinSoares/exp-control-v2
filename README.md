# Exp Control (v2)

A financial control dashboard built with Next.js 16, providing tracking for expenses, revenues, sales, bills, and fuel costs.

## Features

- **Dashboard** — overview with charts and summaries
- **Expenses** — log and categorize spending
- **Revenues** — track income sources
- **Sales** — record sales transactions
- **Bills** — manage recurring bills
- **Fuel** — track fuel costs
- **Authentication** — email/password and Google OAuth via NextAuth v5
- **PWA** — offline support via Serwist

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui, Base UI |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Auth | NextAuth v5 |
| Database | MongoDB (Mongoose) |
| Testing | Vitest + Testing Library |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- Google OAuth credentials (optional)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `AUTH_SECRET` | Random secret for NextAuth session encryption |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test                 # watch mode
npm run test:coverage    # with coverage report
```

## Project Structure

```
app/
  (auth)/              # Login / register pages
  (dashboard)/         # Protected dashboard routes
    bills/
    expenses/
    fuel/
    revenues/
    sales/
  api/                 # API route handlers
components/
  layout/              # Shell components (sidebar, header)
  ui/                  # Reusable UI primitives
  bills|expenses|...   # Feature-specific components
  shared/              # Cross-feature components
lib/
  actions/             # Server actions
  db/                  # Database helpers
  schemas/             # Zod validation schemas
  utils/               # Utility functions
models/                # Mongoose models
store/                 # Zustand stores
types/                 # Shared TypeScript types
hooks/                 # Custom React hooks
constants/             # App-wide constants
```
