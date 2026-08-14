'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useBillsDueSoon } from '@/hooks/queries/bills/use-bills-due-soon'
import { usePayBill } from '@/hooks/mutations/bills/use-pay-bill'
import { formatCurrency } from '@/lib/utils'
import { useCurrencySession } from '@/hooks/use-currency-session'

export default function BillsDueSoon() {
  const { currency } = useCurrencySession()
  const { data: bills, isLoading } = useBillsDueSoon(5)
  const payBill = usePayBill()

  const unpaid = bills?.filter((b) => !b.paid) ?? []

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          Contas a vencer (5 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        )}

        {!isLoading && unpaid.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma conta a vencer
          </p>
        )}

        {!isLoading && unpaid.length > 0 && (
          <ul className="space-y-2">
            {unpaid.map((bill) => (
              <li key={String(bill.id)} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{bill.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Vence: {new Date(bill.expirationDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {formatCurrency(bill.value, currency)}
                </Badge>
                <button
                  onClick={() => payBill.mutate(String(bill.id))}
                  disabled={payBill.isPending}
                  className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                  title="Marcar como pago"
                >
                  <CheckCircle2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
