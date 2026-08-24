import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, createPartFromFunctionResponse, type Content } from '@google/genai'
import { withAuth } from '@/lib/actions/middlewares/auth.middleware'
import { CHAT_TOOLS } from '@/constants/chat-tools'
import { executeToolCall, type ToolInput } from '@/lib/mcp/tool-handlers'
import type { AuthContext } from '@/types/server-types'

export const maxDuration = 60

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
const MAX_ITERATIONS = 10

const buildSystemPrompt = (month: number, year: number, currency: string) =>
  `Você é um assistente financeiro pessoal. Responda sempre em português brasileiro.
Contexto atual: mês ${month}, ano ${year}, moeda ${currency}.
Use as ferramentas disponíveis para consultar despesas e receitas quando necessário.
Apresente valores monetários no formato R$ 1.234,56. Seja conciso e objetivo.`

interface ClientMessage {
  role: 'user' | 'assistant'
  content: string
}

async function handler(req: NextRequest, ctx: AuthContext): Promise<NextResponse> {
  const body = await req.json() as { messages: ClientMessage[]; month: number; year: number }
  const { messages, month, year } = body

  if (!messages?.length) {
    return NextResponse.json({ error: 'messages is required' }, { status: 400 })
  }

  const contents: Content[] = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  let iterations = 0

  while (iterations < MAX_ITERATIONS) {
    iterations++

    const response = await genai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(month, year, ctx.currency),
        tools: [{ functionDeclarations: CHAT_TOOLS }],
      },
    })

    const functionCalls = response.functionCalls

    if (!functionCalls?.length) {
      return NextResponse.json({ role: 'assistant', content: response.text ?? '' })
    }

    const modelParts = response.candidates?.[0]?.content?.parts ?? []
    contents.push({ role: 'model', parts: modelParts })

    const toolResultParts = await Promise.all(
      functionCalls.map(async (call) => {
        const name = call.name ?? ''
        const id = call.id ?? name
        try {
          const result = await executeToolCall(
            name,
            (call.args ?? {}) as ToolInput,
            ctx.userId,
            ctx.currency
          )
          return createPartFromFunctionResponse(id, name, { result: JSON.stringify(result) })
        } catch (err) {
          return createPartFromFunctionResponse(id, name, {
            error: err instanceof Error ? err.message : 'Unknown error',
          })
        }
      })
    )

    contents.push({ role: 'user', parts: toolResultParts })
  }

  return NextResponse.json({ error: 'Max iterations reached' }, { status: 500 })
}

export const POST = withAuth(handler)
