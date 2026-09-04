'use client'

import { MessageRole } from '@/types/server-types'
import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
}

interface ChatState {
  isOpen: boolean
  messages: ChatMessage[]
  isLoading: boolean
  open: () => void
  close: () => void
  toggle: () => void
  addMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

export const useChat = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}))
