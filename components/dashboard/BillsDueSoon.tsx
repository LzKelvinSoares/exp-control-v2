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

  const billsDueSoon = bills?.filter((b) => !b.paid) ?? []
  const unpaid = billsDueSoon

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
          <div data-testid="bills-timeline" className="relative ml-1">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              {unpaid.map((bill, index) => {
                const dueDate = new Date(bill.expirationDate)

                return (
                  <div key={String(bill.id)} className="relative flex items-start gap-3">
                    <div style={{ borderColor: '#291b2a' }}
                      className="relative z-10 flex h-5 w-5 shrink-0 items-center self-center justify-center rounded-full border border-amber-200 bg-amber-50 shadow-sm">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500"  style={{ backgroundColor: 'rgba(97,45,96,0.9)' }} />
                    </div>

                    <div className="flex-1 min-w-0 rounded-lg border border-border bg-muted/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium leading-5">{bill.description}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span>Vence: {dueDate.toLocaleDateString('pt-BR')}</span>
                            {index === 0 && (
                              <Badge variant="secondary" className="h-5 px-1.5 py-0 text-[10px]">
                                Próximo
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Badge variant="outline" className="shrink-0 text-xs">
                          {formatCurrency(bill.value, currency)}
                        </Badge>
                      </div>
                    </div>

                    <button
                      onClick={() => payBill.mutate(String(bill.id))}
                      disabled={payBill.isPending}
                      className="self-center cursor-pointer text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                      aria-label="Marcar como pago"
                      title="Marcar como pago"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
