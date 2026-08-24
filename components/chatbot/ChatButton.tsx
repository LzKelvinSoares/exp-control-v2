'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChat } from '@/store/chat'

export function ChatButton() {
  const { toggle, isOpen } = useChat()

  return (
    <Button
      onClick={toggle}
      size='icon-lg'
      className='fixed bottom-6 right-3 z-40 rounded-full shadow-lg'
      aria-label='Abrir assistente financeiro'
      aria-expanded={isOpen}
    >
      <MessageCircle />
    </Button>
  )
}
