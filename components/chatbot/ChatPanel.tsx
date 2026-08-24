'use client'

import { useRef, useEffect } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatMessage } from './ChatMessage'
import { useChat } from '@/store/chat'
import { useChatPanel } from '@/hooks/chatbot/use-chat-panel'

export function ChatPanel() {
  const { isOpen, close, messages, isLoading, clearMessages } = useChat()
  const { input, setInput, handleSend, handleKeyDown } = useChatPanel()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) close() }}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0" showCloseButton={false}>
        <SheetHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2 border-b">
          <SheetTitle>Assistente Financeiro</SheetTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={clearMessages} title="Limpar conversa">
              <Trash2 />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={close}>
              ✕
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center pt-8">
              Olá! Pergunte sobre suas despesas e receitas.
            </p>
          )}
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
                <span className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t px-4 py-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre suas finanças..."
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
