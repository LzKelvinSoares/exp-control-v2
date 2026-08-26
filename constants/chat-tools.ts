import { Type, type FunctionDeclaration } from '@google/genai';
import { BILL_CATEGORIES } from './categories';

export const TOOL_HANDLER_NAME_OPTIONS = {
  QUERIES: {
    EXPENSES: 'query_expenses',
    REVENUES: 'query_revenues',
    BILLS: 'query_bills',
    EXPENSE_CATEGORIES: 'get_expense_categories'
  },
  SUMMARIES: {
    EXPENSES: 'summarize_expenses',
  }
}

export const CHAT_TOOLS: FunctionDeclaration[] = [
  {
    name: TOOL_HANDLER_NAME_OPTIONS.QUERIES.EXPENSES,
    description:
      "Query the user's expenses with optional filters. Use when the user asks about spending, costs, or expenses. Always pass the year. Pass month when the user refers to a specific month.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        year:        { type: Type.NUMBER, description: 'The year to query (e.g. 2025). Required.' },
        month:       { type: Type.NUMBER, description: 'Optional month 1–12. Omit to query the full year.' },
        type: {
          type: Type.STRING,
          enum: ['CARTAO','COMPRAS','COMPRAS_AVULSAS','RESTAURANTE','ENERGIA','AGUA','GAS','INTERNET','TELEFONE','ALUGUEL','COMBUSTIVEL','OUTROS'],
          description: 'Filter by expense category.',
        },
        responsible:  { type: Type.STRING, description: 'Filter by responsible person (partial match).' },
        description:  { type: Type.STRING, description: 'Filter by description keyword (partial match).' },
        minValue:     { type: Type.NUMBER, description: 'Minimum value inclusive.' },
        maxValue:     { type: Type.NUMBER, description: 'Maximum value inclusive.' },
      },
      required: ['year'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.QUERIES.REVENUES,
    description:
      "Query the user's revenues (income) with optional filters. Use when asked about salary, freelance, investments, or income.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        year:        { type: Type.NUMBER, description: 'The year to query. Required.' },
        month:       { type: Type.NUMBER, description: 'Optional month 1–12.' },
        type: {
          type: Type.STRING,
          enum: ['SALARIO','FREELANCE','INVESTIMENTO','EMPRESTIMO','OUTROS'],
          description: 'Filter by revenue category.',
        },
        responsible:  { type: Type.STRING, description: 'Filter by responsible person (partial match).' },
        description:  { type: Type.STRING, description: 'Filter by description keyword (partial match).' },
        minValue:     { type: Type.NUMBER, description: 'Minimum value inclusive.' },
        maxValue:     { type: Type.NUMBER, description: 'Maximum value inclusive.' },
      },
      required: ['year'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.QUERIES.BILLS,
    description:
      "Query the user's bills with optional filters. Use when asked about due bills, future bills, or past bills.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        year:        { type: Type.NUMBER, description: 'The year to query. Required.' },
        month:       { type: Type.NUMBER, description: 'Optional month 1–12.' },
        type: {
          type: Type.STRING,
          enum: BILL_CATEGORIES.map(b => b.value),
          description: 'Filter by revenue category.',
        },
        responsible:  { type: Type.STRING, description: 'Filter by responsible person (partial match).' },
        description:  { type: Type.STRING, description: 'Filter by description keyword (partial match).' },
        paid:         { type: Type.BOOLEAN, description: 'Filter by paid/unpaid bills.' },
        minValue:     { type: Type.NUMBER, description: 'Minimum value inclusive.' },
        maxValue:     { type: Type.NUMBER, description: 'Maximum value inclusive.' },
      },
      required: ['year'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.SUMMARIES.EXPENSES,
    description:
      'Returns expense totals grouped by category or by responsible person. Use when asked for a breakdown, summary, or comparison by group.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        groupBy: { type: Type.STRING, enum: ['type', 'responsible'], description: 'Group by this field.' },
        year:    { type: Type.NUMBER, description: 'The year to query. Required.' },
        month:   { type: Type.NUMBER, description: 'Optional month 1–12.' },
      },
      required: ['groupBy', 'year'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.QUERIES.EXPENSE_CATEGORIES,
    description:
      'Returns the list of valid expense categories with their Portuguese labels. Call this if you need to know valid type values.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
]

export const maxDuration = 60;
export const MAX_ITERATIONS = 10;

export const buildSystemPrompt = (month: number, year: number, currency: string) =>
  `Você é um assistente financeiro pessoal. Responda sempre em português brasileiro.
Contexto atual: mês ${month}, ano ${year}, moeda ${currency}.
Use as ferramentas disponíveis para consultar despesas e receitas quando necessário.
Apresente valores monetários no formato R$ 1.234,56. Seja conciso e objetivo.`;

export const AI_DEFAULT_MODEL = 'gemini-3.6-flash';
