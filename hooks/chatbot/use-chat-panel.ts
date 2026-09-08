import { useState, type KeyboardEvent } from 'react'
import { useChat } from '@/store/chat'
import { useCalendar } from '@/store/calendar'
import { AI_ROLES, API_ROUTES, HTTP_HEADERS, HTTP_METHODS } from '@/constants'

export function useChatPanel() {
  const { messages, isLoading, addMessage, setLoading } = useChat()
  const { month, year } = useCalendar()
  const [input, setInput] = useState('')

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage = { id: crypto.randomUUID(), role: AI_ROLES.USER, content: text }
    addMessage(userMessage)
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }))

      const res = await fetch(API_ROUTES.chat, {
        method: HTTP_METHODS.POST,
        headers: HTTP_HEADERS.JSON,
        body: JSON.stringify({ messages: history, month, year }),
      })

      if (!res.ok) throw new Error('Falha ao obter resposta')

      const data = await res.json() as { content: string }
      addMessage({ id: crypto.randomUUID(), role: AI_ROLES.ASSISTANT, content: data.content })
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: AI_ROLES.ASSISTANT,
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
