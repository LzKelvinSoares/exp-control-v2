'use client'

import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { CURRENCY_SYMBOLS } from '@/constants'
import { useCurrencySession } from '@/hooks/use-currency-session'
import { parseTableData } from '@/lib/utils'

interface DataCardsProps {
    content: string
}

export function DataTableCards({ content }: DataCardsProps) {
    const { currency } = useCurrencySession()
    const [copied, setCopied] = useState(false)
    const items = parseTableData(content)

    if (items.length === 0) {
        return null
    }

    const handleCopy = () => {
        const text = items
            .map((item) => `${item.date}: ${item.description} — ${item.amount}`)
            .join('\n')
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Dados copiados!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        const text = items
            .map((item) => `${item.date}: ${item.description} — ${item.amount}`)
            .join('\n')

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Dados Financeiros',
                    text: text,
                })
            } catch (err) {
                console.error('Erro ao compartilhar:', err)
            }
        } else {
            handleCopy()
        }
    }

    return (
        <div className="space-y-3 my-3">
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">
                    {items.length} ite{items.length !== 1 ? 'ns' : 'm'}
                </p>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        className="h-7 px-2 text-xs"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleShare}
                        className="h-7 px-2 text-xs"
                    >
                        <Share2 className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-2">
                {items.map((item, idx) => (
                    <Card
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {item.date}
                                </p>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate mt-0.5">
                                    {item.description}
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                {CURRENCY_SYMBOLS[currency || 'BRL']}{item.amount}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
