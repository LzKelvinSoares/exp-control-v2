import { SaleRoom } from '@/types/app-types';

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
  room?: SaleRoom;
  roomDescription?: string;
  buyer?: string;
  valuePaid?: number;
  discount?: number;
  installments?: number;
  bookingDate?: string;
  saleDate?: string;
  firstExpirationDate?: string;
  expirationDate?: string;
  monthsLeft?: number;
  paid?: boolean;
  delivered?: boolean;
  barCode?: string;
  saveAsExpense?: boolean;
  creationDate?: string;
  valuePerLiter?: number;
}

export type GroupSummary = { [key: string]: string | number; total: number };