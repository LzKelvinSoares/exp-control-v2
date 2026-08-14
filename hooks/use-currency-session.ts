import { useSession } from 'next-auth/react'

export function useCurrencySession() {
    const { data: session } = useSession()
    return {
        currency: (session?.user?.currentCurrency ?? 'BRL')
    }
}