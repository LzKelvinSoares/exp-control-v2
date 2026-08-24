import { QueryFilters, ToolInput } from '@/types/server-types';

export function validateYear(year?: number): asserts year is number {
  if (!year) throw new Error('year is required');
}

export function getBudgetQueryFilters(toolInput: ToolInput) {
      const { year, ...rest } = toolInput;
      validateYear(year);
      const filters: QueryFilters = { year, ...rest };
      return filters;
}