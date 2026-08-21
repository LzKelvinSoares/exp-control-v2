import { redirect } from 'next/navigation'
import { auth } from '@/lib/actions/services/auth.service'
import { SalesView } from '@/components/sales/SalesView'

export default async function SalesPage() {
  const session = await auth()

  if (!session?.user?.access?.includes('sales')) {
    redirect('/')
  }

  return <SalesView />
}
