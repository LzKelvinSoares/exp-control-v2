import { withServices } from '../middlewares';
import { NextResponse } from 'next/server';
import { ClientMessage, ToolInput } from '@/types/app-types';
import { Content, createPartFromFunctionResponse, GoogleGenAI } from '@google/genai';
import { AI_DEFAULT_MODEL, buildSystemPrompt, CHAT_TOOLS, MAX_ITERATIONS } from '@/constants';
import { executeToolCall } from '@/lib/mcp/tool-handlers';

export function createChatRoutes() {
    const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const MODEL = process.env.GEMINI_MODEL ?? AI_DEFAULT_MODEL;

    return {
        POST: withServices(async (req, ctx, { }) => {
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
        })
    }
}