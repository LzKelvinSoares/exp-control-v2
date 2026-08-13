'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { buttonVariants } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'

function Banner() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/google-calendar/status')
      .then((r) => r.json())
      .then((data) => setConnected(data.connected))
      .catch(() => setConnected(false))
  }, [])

  useEffect(() => {
    if (searchParams.get('calendar') === 'connected') {
      toast.success('Google Calendar conectado com sucesso!')
      setConnected(true)
      router.replace('/bills')
    }
  }, [searchParams, router])

  if (connected === null || connected === true) return null

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
      <CalendarDays size={16} className="shrink-0" />
      <span>Conecte o Google Calendar para criar lembretes automáticos nas datas de vencimento.</span>
      <a
        href="/api/google-calendar/connect"
        className={buttonVariants({ size: 'sm', variant: 'outline' }) + ' ml-auto shrink-0'}
      >
        Conectar
      </a>
    </div>
  )
}

export default function GoogleCalendarBanner() {
  return (
    <Suspense>
      <Banner />
    </Suspense>
  )
}
