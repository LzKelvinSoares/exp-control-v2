'use client'

import { cn } from '@/lib/utils'
import { hasTableData } from '@/lib/utils/helpers'
import { DataTableCards } from './DataTableCards'
import type { ChatMessage as ChatMessageType } from '@/store/chat'
import { AI_ROLES } from '@/constants'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === AI_ROLES.USER
  const showTableCards = !isUser && hasTableData(message.content)

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        {showTableCards ? (
          <div className="space-y-3">
            <p className="whitespace-pre-wrap break-words leading-relaxed text-muted-foreground mb-2">
              {message.content.split('\n\n')[0]}
            </p>
            <DataTableCards content={message.content} />
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  )
}
