import { useState, type KeyboardEvent } from 'react'
import { useChat } from '@/store/chat'
import { useCalendar } from '@/store/calendar'

export function useChatPanel() {
  const { messages, isLoading, addMessage, setLoading } = useChat()
  const { month, year } = useCalendar()
  const [input, setInput] = useState('')

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content: text }
    addMessage(userMessage)
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, month, year }),
      })

      if (!res.ok) throw new Error('Falha ao obter resposta')

      const data = await res.json() as { content: string }
      addMessage({ id: crypto.randomUUID(), role: 'assistant', content: data.content })
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return { input, setInput, isLoading, handleSend, handleKeyDown }
}
