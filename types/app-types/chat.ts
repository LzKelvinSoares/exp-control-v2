export type MessageRole = 'user' | 'assistant';
export type ToolInputGroupBy = 'type' | 'responsible';

export interface ClientMessage {
  role: MessageRole;
  content: string;
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
}