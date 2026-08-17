'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ServiceProvider } from '@/lib/providers/service-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ServiceProvider>
          {children}
          <Toaster />
        </ServiceProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
