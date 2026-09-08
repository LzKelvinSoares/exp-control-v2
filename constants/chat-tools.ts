import { Type, type FunctionDeclaration } from '@google/genai';
import { BILL_CATEGORIES, EXPENSE_CATEGORIES, REVENUE_CATEGORIES } from './categories';
import { MessageRole } from '@/types/server-types';

export const TOOL_HANDLER_NAME_OPTIONS = {
  QUERIES: {
    EXPENSES: 'query_expenses',
    REVENUES: 'query_revenues',
    BILLS: 'query_bills',
    FUEL: 'query_fuel',
    EXPENSE_CATEGORIES: 'get_expense_categories'
  },
  SUMMARIES: {
    EXPENSES: 'summarize_expenses',
  },
  MUTATIONS: {
    ADD_EXPENSE:    'add_expense',
    ADD_REVENUE:    'add_revenue',
    ADD_FUEL_ENTRY: 'add_fuel_entry',
    ADD_BILL:       'add_bill',
  }
}

export const AI_ROLES: Record<string, MessageRole> = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

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
  {
    name: TOOL_HANDLER_NAME_OPTIONS.QUERIES.FUEL,
    description:
      "Query the user's fuel entries. Use when asked about fuel spending, fuel history, or liters filled.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        year:  { type: Type.NUMBER, description: 'The year to query. Required.' },
        month: { type: Type.NUMBER, description: 'Optional month 1–12.' },
      },
      required: ['year'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_EXPENSE,
    description:
      'Creates a new expense for the user. Use when the user asks to add, register, or record an expense.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        description:       { type: Type.STRING, description: 'Short description of the expense.' },
        type: {
          type: Type.STRING,
          enum: EXPENSE_CATEGORIES.map(c => c.value),
          description: 'Expense category.',
        },
        value:             { type: Type.NUMBER, description: 'Monetary value.' },
        firstExpirationDate: { type: Type.STRING, description: 'ISO date string (YYYY-MM-DD) for the first due date.' },
        responsible:       { type: Type.STRING, description: 'Person responsible (optional).' },
        monthsLeft:        { type: Type.NUMBER, description: 'Number of installments (default 1).' },
      },
      required: ['description', 'type', 'value', 'firstExpirationDate'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_REVENUE,
    description:
      'Creates a new revenue (income) entry for the user. Use when the user asks to add or record income, salary, or a revenue.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        description:       { type: Type.STRING, description: 'Short description of the revenue.' },
        type: {
          type: Type.STRING,
          enum: REVENUE_CATEGORIES.map(c => c.value),
          description: 'Revenue category.',
        },
        value:             { type: Type.NUMBER, description: 'Monetary value.' },
        firstExpirationDate: { type: Type.STRING, description: 'ISO date string (YYYY-MM-DD) for the reference date.' },
        responsible:       { type: Type.STRING, description: 'Person responsible (optional).' },
        monthsLeft:        { type: Type.NUMBER, description: 'Number of installments (default 1).' },
      },
      required: ['description', 'type', 'value', 'firstExpirationDate'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_FUEL_ENTRY,
    description:
      'Creates a new fuel entry. Use when the user asks to register or add a fuel fill-up.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        creationDate:   { type: Type.STRING, description: 'ISO date string (YYYY-MM-DD) of the fill-up.' },
        value:          { type: Type.NUMBER, description: 'Total cost of the fill-up.' },
        valuePerLiter:  { type: Type.NUMBER, description: 'Price per liter.' },
      },
      required: ['creationDate', 'value', 'valuePerLiter'],
    },
  },
  {
    name: TOOL_HANDLER_NAME_OPTIONS.MUTATIONS.ADD_BILL,
    description:
      'Creates a new bill (conta) for the user. Optionally also saves it as an expense. A Google Calendar event is created automatically if the user has connected their calendar.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        description:    { type: Type.STRING, description: 'Short description of the bill.' },
        type: {
          type: Type.STRING,
          enum: BILL_CATEGORIES.map(b => b.value),
          description: 'Bill category.',
        },
        value:          { type: Type.NUMBER, description: 'Bill amount.' },
        expirationDate: { type: Type.STRING, description: 'ISO date string (YYYY-MM-DD) for the due date.' },
        barCode:        { type: Type.STRING, description: 'Bar code of the bill (optional).' },
        saveAsExpense:  { type: Type.BOOLEAN, description: 'If true, also creates a matching expense entry.' },
      },
      required: ['description', 'type', 'value', 'expirationDate'],
    },
  },
]

export const maxDuration = 60;
export const MAX_ITERATIONS = 10;

export const buildSystemPrompt = (month: number, year: number, currency: string) =>
  `Você é um assistente financeiro pessoal. Responda sempre em português brasileiro.
Contexto atual: mês ${month}, ano ${year}, moeda ${currency}.
Use as ferramentas disponíveis para consultar ou criar despesas, receitas, abastecimentos e contas quando necessário.
Apresente valores monetários no formato R$ 1.234,56. Seja conciso e objetivo.`;

export const AI_DEFAULT_MODEL = 'gemini-3.6-flash';
