export type MessageRole = 'user' | 'assistant';
export type ToolInputGroupBy = 'type' | 'responsible';

export interface ClientMessage {
  role: MessageRole;
  content: string;
}

export interface IChatRequest {
  messages: ClientMessage[];
  month: number;
  year: number;
}

export interface ToolInput {
  year?: number;
  month?: number;
  type?: string;
  responsible?: string;
  description?: string;
  minValue?: number;
  maxValue?: number;
  groupBy?: ToolInputGroupBy;
  // mutation fields
  value?: number;
  firstExpirationDate?: string;
  expirationDate?: string;
  monthsLeft?: number;
  paid?: boolean;
  barCode?: string;
  saveAsExpense?: boolean;
  creationDate?: string;
  valuePerLiter?: number;
}

export type GroupSummary = { [key: string]: string | number; total: number };